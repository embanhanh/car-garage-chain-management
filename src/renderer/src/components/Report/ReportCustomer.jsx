import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

function ReportCustomer({ dateRange = 'week', selectedDate = new Date() }) {
    const [customerData, setCustomerData] = useState([
        {
            customerId: '',
            customerName: '',
            quantity: 0
        }
    ])
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    })
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5 // Số item trên mỗi trang
    const [isLoading, setIsLoading] = useState(false)

    const processAndUpdateChartData = (serviceRegisters) => {
        if (!Array.isArray(serviceRegisters) || serviceRegisters.length === 0) {
            setChartData({
                labels: ['Không có dữ liệu'],
                datasets: [
                    {
                        label: 'Số lần sử dụng dịch vụ',
                        data: [1],
                        backgroundColor: ['#e0e0e0'],
                        borderColor: ['#cccccc'],
                        borderWidth: 1
                    }
                ]
            })
            return
        }

        // Tạo map để đếm số lần sử dụng dịch vụ của mỗi khách hàng
        const customerVisits = serviceRegisters.reduce((acc, register) => {
            // Kiểm tra đầy đủ dữ liệu
            if (register?.car?.customer?.name) {
                const customerId = register.car.customer.id
                const customerName = register.car.customer.name

                if (!acc[customerId]) {
                    acc[customerId] = {
                        id: customerId,
                        name: customerName,
                        visitCount: 0
                    }
                }
                acc[customerId].visitCount++
            }
            return acc
        }, {})

        // Chuyển đổi map thành array và sắp xếp
        const customersArray = Object.values(customerVisits).sort(
            (a, b) => b.visitCount - a.visitCount
        )

        // Tạo labels và data riêng biệt
        const labels = customersArray.map((customer) => customer.name || 'Không xác định')
        const data = customersArray.map((customer) => customer.visitCount)

        // Log để debug
        console.log('Labels:', labels)
        console.log('Data:', data)

        // Cập nhật state
        setCustomerData(customersArray)

        // Cập nhật chart data
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Số lần sử dụng dịch vụ',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        })
    }

    const fetchCustomerData = async (dateRange, selectedDate) => {
        setIsLoading(true)
        try {
            const now = selectedDate || new Date()
            let startDate, endDate

            switch (dateRange) {
                case 'week':
                    startDate = startOfWeek(now, { weekStartsOn: 1 })
                    endDate = endOfWeek(now, { weekStartsOn: 1 })
                    break
                case 'month':
                    startDate = startOfMonth(now)
                    endDate = endOfMonth(now)
                    break
                case 'year':
                    startDate = startOfYear(now)
                    endDate = endOfYear(now)
                    break
                default:
                    startDate = startOfWeek(now, { weekStartsOn: 1 })
                    endDate = endOfWeek(now, { weekStartsOn: 1 })
            }

            const response = await getServiceRegisterByGarageId(
                JSON.parse(localStorage.getItem('currentGarage'))?.id,
                startDate,
                endDate
            )

            if (Array.isArray(response)) {
                processAndUpdateChartData(response)
            }
        } catch (error) {
            console.error('Error fetching customer data:', error)
            setCustomerData([])
            processAndUpdateChartData([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomerData(dateRange, selectedDate)
    }, [dateRange, selectedDate])

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: `Thống kê khách hàng - ${getDateRangeText(dateRange, selectedDate)}`,
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: 20
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        if (context.label === undefined) return 'Không xác định'
                        const value = context.raw || 0
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
                        return `${context.label}: ${value} lần (${percentage}%)`
                    }
                }
            }
        }
    }

    // Tính toán số trang
    const totalPages = Math.ceil(customerData.length / itemsPerPage)

    // Lấy dữ liệu cho trang hiện tại
    const currentCustomerData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return customerData.slice(start, start + itemsPerPage)
    }, [currentPage, customerData])

    // Xử lý thay đổi trang
    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    const handleExportExcel = async () => {
        const columns = [
            { header: 'STT', key: 'stt', width: 10 },
            { header: 'Tên khách hàng', key: 'customerName', width: 30 },
            { header: 'Số lần sử dụng dịch vụ', key: 'visitCount', width: 25 },
            { header: 'Tỷ lệ (%)', key: 'percentage', width: 15 }
        ]

        const totalVisits = customerData.reduce((sum, c) => sum + c.visitCount, 0)

        const excelData = customerData.map((customer, index) => ({
            stt: index + 1,
            customerName: customer.name,
            visitCount: customer.visitCount,
            percentage: ((customer.visitCount / totalVisits) * 100).toFixed(1)
        }))

        // Thêm dòng tổng cộng
        excelData.push({
            stt: '',
            customerName: 'Tổng cộng',
            visitCount: totalVisits,
            percentage: '100.0'
        })

        const filename = `thong_ke_khach_hang_${dateRange}_${format(selectedDate, 'dd-MM-yyyy')}.xlsx`

        try {
            const result = await exportExcel(columns, excelData, filename)
            if (result.success) {
                console.log('Xuất Excel thành công!')
            } else {
                console.error('Lỗi khi xuất Excel:', result.error)
            }
        } catch (error) {
            console.error('Lỗi khi xuất Excel:', error)
        }
    }

    return (
        <div className="report-stock">
            {/* <div className="report-stock__table">
                <p className="report__table-title">
                    Danh sách khách hàng từ {getDateRangeText(dateRange, selectedDate)}
                </p>
                {isLoading ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '200px' }}
                    >
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                ) : customerData.length <= 1 && customerData[0].customerId === '' ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '200px' }}
                    >
                        <p>Không có dữ liệu</p>
                    </div>
                ) : (
                    <>
                        <table className="page-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên khách hàng</th>
                                    <th>Số lần sử dụng dịch vụ</th>
                                    <th>Tỷ lệ (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCustomerData.map((customer, index) => {
                                    const totalVisits = customerData.reduce(
                                        (sum, c) => sum + c.visitCount,
                                        0
                                    )
                                    const percentage = (
                                        (customer.visitCount / totalVisits) *
                                        100
                                    ).toFixed(1)
                                    return (
                                        <tr key={customer.id}>
                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.visitCount}</td>
                                            <td>{percentage}%</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td
                                        colSpan="2"
                                        style={{ textAlign: 'right', fontWeight: 'bold' }}
                                    >
                                        Tổng cộng:
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>
                                        {customerData.reduce((sum, c) => sum + c.visitCount, 0)}
                                    </td>
                                    <td style={{ fontWeight: 'bold' }}>100%</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div className="z-pagination">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div> */}

            <div className="report-stock__charts">
                <div className="report-stock__chart-container" style={{ height: '500px' }}>
                    {isLoading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '200px' }}
                        >
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                    ) : customerData.length <= 1 && customerData[0].customerId === '' ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '200px' }}
                        >
                            <p>Không có dữ liệu</p>
                        </div>
                    ) : (
                        <Pie options={chartOptions} data={chartData} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReportCustomer
