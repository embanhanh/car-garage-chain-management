import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import * as XLSX from 'xlsx'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { startOfYear, endOfYear } from 'date-fns'
import { getBillsByGarageId } from '../../controllers/billController'
import { getInputComponentRegisterByGarageId } from '../../controllers/inputComponentRegisterController'
import { format } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const ReportRevenue = forwardRef(({ selectedDate = new Date() }, ref) => {
    const garageId = JSON.parse(localStorage.getItem('currentGarage'))?.id
    const [data, setData] = useState([
        {
            revenue: 0,
            cost: 0,
            profit: 0
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Doanh thu',
                data: [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3
            },
            {
                label: 'Chi phí',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3
            },
            {
                label: 'Lợi nhuận',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3
            }
        ]
    })

    const processDataByMonth = async (startDate, endDate) => {
        try {
            const [bills, inputComponents] = await Promise.all([
                getBillsByGarageId(garageId, startDate, endDate),
                getInputComponentRegisterByGarageId(garageId, startDate, endDate)
            ])

            // Khởi tạo mảng dữ liệu cho 12 tháng
            const monthlyData = Array(12)
                .fill(0)
                .map(() => ({
                    revenue: 0,
                    cost: 0,
                    profit: 0
                }))

            // Xử lý doanh thu từ bills
            if (bills && Array.isArray(bills)) {
                bills.forEach((bill) => {
                    if (bill.createdAt) {
                        const month = new Date(bill.createdAt).getMonth()
                        monthlyData[month].revenue += bill.total || 0
                    }
                })
            }

            // Xử lý chi phí từ inputComponents
            if (inputComponents && Array.isArray(inputComponents)) {
                inputComponents.forEach((input) => {
                    if (input.createdAt && input.details) {
                        const month = new Date(input.createdAt).getMonth()
                        const totalCost = input.details.reduce(
                            (sum, detail) => sum + detail.quantity * detail.inputPrice,
                            0
                        )
                        monthlyData[month].cost += totalCost
                    }
                })
            }

            // Tính lợi nhuận cho từng tháng
            monthlyData.forEach((data) => {
                data.profit = data.revenue - data.cost
            })

            return monthlyData
        } catch (error) {
            console.error('Error processing data:', error)
            throw error
        }
    }

    const fetchDataByDateRange = async () => {
        setIsLoading(true)
        try {
            const now = selectedDate || new Date()
            const startDate = startOfYear(now)
            const endDate = endOfYear(now)

            const monthlyData = await processDataByMonth(startDate, endDate)

            // Cập nhật data state với dữ liệu theo tháng
            setData(monthlyData)

            // Cập nhật chart data
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
                        label: 'Doanh thu',
                        data: monthlyData.map((data) => data.revenue),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        tension: 0.3
                    },
                    {
                        label: 'Chi phí',
                        data: monthlyData.map((data) => data.cost),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.3
                    },
                    {
                        label: 'Lợi nhuận',
                        data: monthlyData.map((data) => data.profit),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        tension: 0.3
                    }
                ]
            })
        } catch (error) {
            console.error('Error fetching data:', error)
            // Reset data về mảng với một phần tử mặc định
            setData([
                {
                    revenue: 0,
                    cost: 0,
                    profit: 0
                }
            ])
            setChartData({
                labels: [],
                datasets: []
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDataByDateRange()
    }, [selectedDate])

    useEffect(() => {
        console.log('data:', data)
    }, [data])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `Thống kê doanh thu năm ${format(selectedDate, 'yyyy')}`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || ''
                        if (label) {
                            label += ': '
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(context.parsed.y)
                        }
                        return label
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            maximumSignificantDigits: 3
                        }).format(value)
                    }
                }
            }
        }
    }

    useImperativeHandle(ref, () => ({
        exportToExcel: () => {
            try {
                const wb = XLSX.utils.book_new()

                // 1. Tạo worksheet tổng quan theo tháng
                const monthlyData = chartData.labels.map((month, index) => ({
                    Tháng: month,
                    'Doanh thu': chartData.datasets[0].data[index],
                    'Chi phí': chartData.datasets[1].data[index],
                    'Lợi nhuận': chartData.datasets[2].data[index]
                }))

                // Tính tổng
                const totals = monthlyData.reduce(
                    (acc, curr) => ({
                        Tháng: 'Tổng cộng',
                        'Doanh thu': acc['Doanh thu'] + curr['Doanh thu'],
                        'Chi phí': acc['Chi phí'] + curr['Chi phí'],
                        'Lợi nhuận': acc['Lợi nhuận'] + curr['Lợi nhuận']
                    }),
                    { 'Doanh thu': 0, 'Chi phí': 0, 'Lợi nhuận': 0 }
                )

                monthlyData.push(totals)

                // 2. Tạo worksheet chi tiết doanh thu
                const detailedRevenueData = data.map((item, index) => ({
                    Tháng: chartData.labels[index],
                    'Doanh thu': item.revenue,
                    'Chi phí nhập hàng': item.cost,
                    'Lợi nhuận': item.profit,
                    'Tỷ suất lợi nhuận (%)': item.revenue
                        ? ((item.profit / item.revenue) * 100).toFixed(2)
                        : 0
                }))

                const wsSummary = XLSX.utils.json_to_sheet(monthlyData)
                const wsDetailed = XLSX.utils.json_to_sheet(detailedRevenueData)

                // Định dạng độ rộng cột
                const colWidths = [
                    { wch: 15 }, // Tháng
                    { wch: 20 }, // Doanh thu
                    { wch: 20 }, // Chi phí
                    { wch: 20 }, // Lợi nhuận
                    { wch: 20 } // Tỷ suất lợi nhuận
                ]

                wsSummary['!cols'] = colWidths
                wsDetailed['!cols'] = colWidths

                // Định dạng tiền tệ
                const formatCurrency = (value) => {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(value)
                }

                // Áp dụng định dạng tiền tệ cho cả hai worksheet
                ;[wsSummary, wsDetailed].forEach((ws) => {
                    const range = XLSX.utils.decode_range(ws['!ref'])
                    for (let row = 2; row <= range.e.r + 1; row++) {
                        // Định dạng cột doanh thu, chi phí, lợi nhuận
                        ;['B', 'C', 'D'].forEach((col) => {
                            const cell = ws[`${col}${row}`]
                            if (cell && typeof cell.v === 'number') {
                                cell.v = formatCurrency(cell.v)
                                cell.t = 's'
                            }
                        })

                        // Định dạng cột tỷ suất lợi nhuận (nếu có)
                        const percentCell = ws[`E${row}`]
                        if (percentCell && typeof percentCell.v === 'number') {
                            percentCell.v = `${percentCell.v}%`
                            percentCell.t = 's'
                        }
                    }
                })

                // Thêm style cho header
                const headerStyle = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: 'CCCCCC' } },
                    alignment: { horizontal: 'center' }
                }

                // Áp dụng style cho header của cả hai worksheet
                ;[wsSummary, wsDetailed].forEach((ws) => {
                    const range = XLSX.utils.decode_range(ws['!ref'])
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        const address = XLSX.utils.encode_cell({ r: 0, c: C })
                        if (!ws[address]) continue
                        ws[address].s = headerStyle
                    }
                })

                // Thêm các worksheet vào workbook
                XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng quan')
                XLSX.utils.book_append_sheet(wb, wsDetailed, 'Chi tiết doanh thu')

                // Xuất file dưới dạng blob và tải xuống
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
                const blob = new Blob([wbout], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })

                // Tạo URL cho blob
                const url = window.URL.createObjectURL(blob)

                // Tạo tên file với năm
                const fileName = `Bao_cao_doanh_thu_${format(selectedDate, 'yyyy')}.xlsx`

                // Tạo thẻ a ẩn và kích hoạt
                const a = document.createElement('a')
                a.href = url
                a.download = fileName
                document.body.appendChild(a)
                a.click()

                // Cleanup
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } catch (error) {
                console.error('Error exporting to Excel:', error)
                alert('Có lỗi khi xuất file Excel')
            }
        }
    }))

    return (
        <div className="report-revenue">
            <div className="report-revenue__charts">
                <div className="report-revenue__chart-container" style={{ height: '400px' }}>
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
                        <Line options={options} data={chartData} />
                    )}
                </div>
            </div>
        </div>
    )
})

export default ReportRevenue
