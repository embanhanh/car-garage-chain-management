import React, {
    forwardRef,
    useImperativeHandle,
    useEffect,
    useState,
    useMemo,
    useCallback
} from 'react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
} from 'chart.js'
import * as XLSX from 'xlsx'

import { getServiceRegisterByGarageId } from '../../controllers/serviceRegisterController'
import './Report.css'
import { getDateRangeText } from '../../utils/StringUtil'
import {
    format,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    parseISO,
    getWeek
} from 'date-fns'
import Pagination from '../Pagination'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

const ReportCustomer = forwardRef(({ selectedDate = new Date() }, ref) => {
    const [data, setData] = useState([])
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 1
            }
        ]
    })
    const [detailedData, setDetailedData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log(data)
    }, [data])

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        exportToExcel: () => {
            try {
                // Tạo workbook mới
                const wb = XLSX.utils.book_new()

                // 1. Tạo worksheet thống kê theo tháng
                const monthlyData = chartData.labels.map((month, index) => ({
                    Tháng: month,
                    'Số lượt xe': chartData.datasets[0].data[index]
                }))

                const totalVisits = chartData.datasets[0].data.reduce(
                    (sum, current) => sum + current,
                    0
                )

                monthlyData.push({
                    Tháng: 'Tổng cộng',
                    'Số lượt xe': totalVisits
                })

                const wsMonthly = XLSX.utils.json_to_sheet(monthlyData)

                // 2. Tạo worksheet chi tiết
                const wsDetailed = XLSX.utils.json_to_sheet(detailedData)

                // Điều chỉnh độ rộng cột cho cả hai worksheet
                const monthlyColWidths = [
                    { wch: 15 }, // Tháng
                    { wch: 15 } // Số lượt xe
                ]

                const detailedColWidths = [
                    { wch: 15 }, // Mã đăng ký
                    { wch: 15 }, // Ngày đăng ký
                    { wch: 15 }, // Biển số xe
                    { wch: 20 }, // Hiệu xe
                    { wch: 25 }, // Chủ xe
                    { wch: 15 }, // Số điện thoại
                    { wch: 40 }, // Địa chỉ
                    { wch: 30 }, // Nhân viên phụ trách
                    { wch: 40 }, // Dịch vụ sử dụng
                    { wch: 50 }, // Phụ tùng thay thế
                    { wch: 15 }, // Chi phí dịch vụ
                    { wch: 15 }, // Chi phí phụ tùng
                    { wch: 15 }, // Tổng chi phí
                    { wch: 15 }, // Trạng thái
                    { wch: 20 } // Ngày dự kiến hoàn thành
                ]

                wsMonthly['!cols'] = monthlyColWidths
                wsDetailed['!cols'] = detailedColWidths

                // Thêm style cho header
                const headerStyle = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: 'CCCCCC' } },
                    alignment: { horizontal: 'center' }
                }

                // Áp dụng style cho cả hai worksheet
                ;[wsMonthly, wsDetailed].forEach((ws) => {
                    const range = XLSX.utils.decode_range(ws['!ref'])
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        const address = XLSX.utils.encode_cell({ r: 0, c: C })
                        if (!ws[address]) continue
                        ws[address].s = headerStyle
                    }
                })

                // Thêm định dạng số tiền trong hàm exportToExcel
                const formatCurrency = (value) => {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(value)
                }

                // Định dạng các cột tiền tệ sau khi tạo worksheet
                const moneyColumns = ['K', 'L', 'M'] // Cột chi phí dịch vụ, phụ tùng, tổng
                const range = XLSX.utils.decode_range(wsDetailed['!ref'])
                moneyColumns.forEach((col) => {
                    for (let row = 2; row <= range.e.r + 1; row++) {
                        const cell = wsDetailed[`${col}${row}`]
                        if (cell && cell.v) {
                            cell.v = formatCurrency(cell.v)
                            cell.t = 's' // Đặt kiểu dữ liệu là string
                        }
                    }
                })

                // Thêm các worksheet vào workbook
                XLSX.utils.book_append_sheet(wb, wsMonthly, 'Thống kê theo tháng')
                XLSX.utils.book_append_sheet(wb, wsDetailed, 'Chi tiết lượt xe')

                // Xuất file
                const fileName = `Thong_ke_luot_xe_${format(selectedDate, 'yyyy')}.xlsx`
                XLSX.writeFile(wb, fileName)
            } catch (error) {
                console.error('Error exporting to Excel:', error)
                alert('Có lỗi khi xuất file Excel')
            }
        }
    }))

    const processDataByMonth = (serviceRegisters) => {
        if (!Array.isArray(serviceRegisters)) return []

        // Khởi tạo mảng đếm cho 12 tháng
        const monthlyCount = Array(12).fill(0)

        // Lưu thông tin chi tiết của từng lượt đăng ký
        const detailedInfo = []

        // Đếm số lượng serviceRegisters cho mỗi tháng
        serviceRegisters.forEach((register) => {
            if (register.createdAt) {
                const month = new Date(register.createdAt).getMonth()
                monthlyCount[month]++

                // Tính tổng giá trị phụ tùng
                const componentTotal =
                    register.repairRegisters?.reduce((total, repair) => {
                        const componentCost =
                            repair.repairRegisterComponents?.reduce((sum, comp) => {
                                return sum + comp.quantity * (comp.component?.price || 0)
                            }, 0) || 0
                        return total + componentCost
                    }, 0) || 0

                // Tính tổng giá dịch vụ
                const serviceTotal =
                    register.repairRegisters?.reduce((total, repair) => {
                        return total + (repair.service?.price || 0)
                    }, 0) || 0

                // Lấy danh sách dịch vụ
                const services = register.repairRegisters
                    ?.map((repair) => repair.service?.name)
                    .filter(Boolean)
                    .join(', ')

                // Lấy danh sách phụ tùng
                const components = register.repairRegisters
                    ?.reduce((acc, repair) => {
                        const components =
                            repair.repairRegisterComponents?.map(
                                (comp) => `${comp.component?.name} (x${comp.quantity})`
                            ) || []
                        return [...acc, ...components]
                    }, [])
                    .join(', ')

                // Lấy danh sách nhân viên
                const employees = register.repairRegisters?.reduce((acc, repair) => {
                    const employees = repair.employees?.map((emp) => emp.name) || []
                    return [...acc, ...employees]
                }, [])
                const uniqueEmployees = [...new Set(employees)].join(', ')

                // Lưu thông tin chi tiết
                detailedInfo.push({
                    'Mã đăng ký': register.id,
                    'Ngày đăng ký': format(new Date(register.createdAt), 'dd/MM/yyyy'),
                    'Biển số xe': register.car?.licensePlate || 'N/A',
                    'Hiệu xe': `${register.car?.brand || ''} ${register.car?.model || ''}`,
                    'Chủ xe': register.car?.customer?.name || 'N/A',
                    'Số điện thoại': register.car?.customer?.phone || 'N/A',
                    'Địa chỉ': register.car?.customer?.address || 'N/A',
                    'Nhân viên phụ trách': uniqueEmployees || 'N/A',
                    'Dịch vụ sử dụng': services || 'N/A',
                    'Phụ tùng thay thế': components || 'N/A',
                    'Chi phí dịch vụ': serviceTotal,
                    'Chi phí phụ tùng': componentTotal,
                    'Tổng chi phí': serviceTotal + componentTotal,
                    'Trạng thái': register.status || 'N/A',
                    'Ngày dự kiến hoàn thành': register.expectedCompletionDate
                        ? format(new Date(register.expectedCompletionDate), 'dd/MM/yyyy')
                        : 'N/A'
                })
            }
        })

        setDetailedData(detailedInfo)
        return monthlyCount
    }

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const now = selectedDate || new Date()
            const startDate = startOfYear(now)
            const endDate = endOfYear(now)

            const response = await getServiceRegisterByGarageId(
                JSON.parse(localStorage.getItem('currentGarage'))?.id,
                startDate,
                endDate
            )

            if (Array.isArray(response)) {
                const monthlyData = processDataByMonth(response)

                setChartData({
                    labels: [
                        'Tháng 1',
                        'Tháng 2',
                        'Tháng 3',
                        'Tháng 4',
                        'Tháng 5',
                        'Tháng 6',
                        'Tháng 7',
                        'Tháng 8',
                        'Tháng 9',
                        'Tháng 10',
                        'Tháng 11',
                        'Tháng 12'
                    ],
                    datasets: [
                        {
                            label: 'Số lượt xe',
                            data: monthlyData,
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            borderColor: 'rgb(53, 162, 235)',
                            borderWidth: 1
                        }
                    ]
                })
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            setChartData({
                labels: [],
                datasets: []
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedDate])

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `Thống kê lượt xe năm ${format(selectedDate, 'yyyy')}`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return value + ' lượt'
                    }
                }
            }
        },
        barPercentage: 0.8,
        categoryPercentage: 0.9
    }

    return (
        <div className="report-stock">
            <div className="report-stock__charts">
                <div className="report-stock__chart-container" style={{ height: '500px' }}>
                    {isLoading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: '100%' }}
                        >
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                    ) : (
                        <Bar options={chartOptions} data={chartData} />
                    )}
                </div>
            </div>
        </div>
    )
})

export default ReportCustomer
