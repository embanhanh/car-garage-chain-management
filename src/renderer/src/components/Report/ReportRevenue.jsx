import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'
import { getBillsByDate } from '../../controllers/billController'
import { getDateRangeText } from '../../utils/StringUtil'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function ReportRevenue({ dateRange = 'week', selectedDate = new Date() }) {
    const [revenueData, setRevenueData] = useState([
        {
            serviceName: '',
            customerName: '',
            totalRevenue: 0,
            totalCost: 0,
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
                backgroundColor: 'rgba(53, 162, 235, 0.8)',
                stack: 'Stack 0'
            },
            {
                label: 'Chi phí',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                stack: 'Stack 1'
            }
        ]
    })

    const fetchDataByDateRange = async () => {
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

            const response = await getBillsByDate(startDate, endDate)

            if (!response || !Array.isArray(Object.values(response))) {
                console.warn('Invalid response:', response)
                return
            }

            // Chuyển đổi object thành array
            const responseArray = Object.values(response)

            // Tổng hợp dữ liệu theo dịch vụ
            const aggregatedData = responseArray.reduce((acc, bill) => {
                bill.services?.forEach((service) => {
                    const serviceId = service.id
                    if (!acc[serviceId]) {
                        acc[serviceId] = {
                            serviceName: service.name || 'Unknown',
                            customerName: bill.customer?.name || 'Unknown',
                            totalRevenue: 0,
                            totalCost: 0,
                            profit: 0
                        }
                    }

                    // Tính toán doanh thu và chi phí
                    const revenue = service.price || 0
                    const cost =
                        service.components?.reduce(
                            (total, comp) => total + (comp.quantity || 0) * (comp.inputPrice || 0),
                            0
                        ) || 0

                    acc[serviceId].totalRevenue += revenue
                    acc[serviceId].totalCost += cost
                    acc[serviceId].profit += revenue - cost
                })
                return acc
            }, {})

            // Chuyển đổi từ object sang array
            const result = Object.values(aggregatedData)
            setRevenueData(result)

            // Cập nhật dữ liệu biểu đồ
            setChartData({
                labels: result.map((item) => item.serviceName),
                datasets: [
                    {
                        label: 'Doanh thu',
                        data: result.map((item) => item.totalRevenue),
                        backgroundColor: 'rgba(53, 162, 235, 0.8)',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Chi phí',
                        data: result.map((item) => item.totalCost),
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        stack: 'Stack 1'
                    }
                ]
            })
        } catch (error) {
            console.error('Error fetching data:', error)
            setRevenueData([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDataByDateRange()
    }, [dateRange, selectedDate])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `Thống kê doanh thu ${getDateRangeText(dateRange, selectedDate)}`,
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

    return (
        <div className="report-revenue">
            <div className="report-revenue__table-container">
                <p className="report__table-title">
                    Thống kê doanh thu {getDateRangeText(dateRange, selectedDate)}
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
                ) : revenueData.length === 0 ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '200px' }}
                    >
                        <p>Không có dữ liệu</p>
                    </div>
                ) : (
                    <table className="page-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên dịch vụ</th>
                                <th>Khách hàng</th>
                                <th>Doanh thu</th>
                                <th>Chi phí</th>
                                <th>Lợi nhuận</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenueData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.serviceName}</td>
                                    <td>{item.customerName}</td>
                                    <td>{item.totalRevenue.toLocaleString('vi-VN')}đ</td>
                                    <td>{item.totalCost.toLocaleString('vi-VN')}đ</td>
                                    <td>{item.profit.toLocaleString('vi-VN')}đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    Tổng cộng:
                                </td>
                                <td style={{ fontWeight: 'bold' }}>
                                    {revenueData
                                        .reduce((sum, item) => sum + item.totalRevenue, 0)
                                        .toLocaleString('vi-VN')}
                                    đ
                                </td>
                                <td style={{ fontWeight: 'bold' }}>
                                    {revenueData
                                        .reduce((sum, item) => sum + item.totalCost, 0)
                                        .toLocaleString('vi-VN')}
                                    đ
                                </td>
                                <td style={{ fontWeight: 'bold' }}>
                                    {revenueData
                                        .reduce((sum, item) => sum + item.profit, 0)
                                        .toLocaleString('vi-VN')}
                                    đ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>

            <div className="report-revenue__charts">
                <div className="report-revenue__chart-container" style={{ height: '400px' }}>
                    {isLoading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '200px' }}
                        >
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                        </div>
                    ) : revenueData.length === 0 ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '200px' }}
                        >
                            <p>Không có dữ liệu</p>
                        </div>
                    ) : (
                        <Bar options={options} data={chartData} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReportRevenue
