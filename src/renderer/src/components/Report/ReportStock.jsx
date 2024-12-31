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
import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    format,
    getWeek
} from 'date-fns'
import { getInputComponentRegisterByDate } from '../../controllers/inputComponentRegisterController'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function ReportStock({ dateRange = 'week', selectedDate = new Date() }) {
    const [partsData, setPartsData] = useState([])
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng nhập',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.8)',
                borderColor: 'rgba(53, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    })

    const getDateRangeText = () => {
        const now = selectedDate || new Date()
        switch (dateRange) {
            case 'week':
                const weekStart = startOfWeek(now, { weekStartsOn: 1 })
                const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
                return `từ ${format(weekStart, 'dd/MM/yyyy')} đến ${format(weekEnd, 'dd/MM/yyyy')}`
            case 'month':
                const monthStart = startOfMonth(now)
                const monthEnd = endOfMonth(now)
                return `từ ${format(monthStart, 'dd/MM/yyyy')} đến ${format(monthEnd, 'dd/MM/yyyy')}`
            case 'year':
                const yearStart = startOfYear(now)
                const yearEnd = endOfYear(now)
                return `từ ${format(yearStart, 'dd/MM/yyyy')} đến ${format(yearEnd, 'dd/MM/yyyy')}`
            default:
                return ''
        }
    }

    const fetchDataByDateRange = async () => {
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

            const response = await getInputComponentRegisterByDate(startDate, endDate)

            if (!response || !Array.isArray(response)) {
                console.warn('Invalid response:', response)
                return
            }

            // Tổng hợp dữ liệu theo componentId
            const aggregatedData = response.reduce((acc, register) => {
                register.details?.forEach((detail) => {
                    const componentId = detail.componentId
                    if (!acc[componentId]) {
                        acc[componentId] = {
                            componentId: componentId,
                            componentName: detail.component?.name || 'Unknown',
                            categoryName: detail.component?.category?.name || 'Unknown',
                            quantity: 0,
                            inputPrice: detail.inputPrice || 0,
                            totalPrice: 0
                        }
                    }
                    acc[componentId].quantity += detail.quantity || 0
                    acc[componentId].totalPrice += detail.quantity * detail.inputPrice || 0
                })
                return acc
            }, {})

            const result = Object.values(aggregatedData)
            setPartsData(result)

            // Sắp xếp dữ liệu theo số lượng giảm dần
            const sortedData = [...result].sort((a, b) => b.quantity - a.quantity)

            setChartData({
                labels: sortedData.map((item) => item.componentName),
                datasets: [
                    {
                        label: 'Số lượng nhập',
                        data: sortedData.map((item) => item.quantity),
                        backgroundColor: 'rgba(53, 162, 235, 0.8)',
                        borderColor: 'rgba(53, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            })
        } catch (error) {
            console.error('Error fetching data:', error)
            setPartsData([])
        }
    }

    useEffect(() => {
        fetchDataByDateRange()
    }, [dateRange, selectedDate])

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `Thống kê số lượng nhập kho ${getDateRangeText()}`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Số lượng nhập'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tên phụ tùng'
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 0
                }
            }
        }
    }

    return (
        <div className="report-stock">
            <div className="report-stock__table-container">
                <h2 className="report-stock__title">
                    Danh sách phụ tùng đã nhập{' '}
                    <span className="report-stock__date">{getDateRangeText()}</span>
                </h2>
                <table className="report-stock__table">
                    <thead>
                        <tr>
                            <th>Tên phụ tùng</th>
                            <th>Loại</th>
                            <th>Số lượng nhập</th>
                            <th>Giá nhập</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partsData.map((item, index) => (
                            <tr key={item.componentId || index}>
                                <td>{item.componentName}</td>
                                <td>{item.categoryName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.inputPrice?.toLocaleString('vi-VN')}đ</td>
                                <td>{item.totalPrice?.toLocaleString('vi-VN')}đ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="report-stock__charts">
                <div
                    className="report-stock__chart-container"
                    style={{ height: '400px', marginBottom: '2rem' }}
                >
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>
        </div>
    )
}

export default ReportStock
