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
import { getDateRangeText } from '../../utils/StringUtil'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function ReportStock({ dateRange = 'week', selectedDate = new Date() }) {
    const [componentsData, setComponentsData] = useState([
        {
            componentName: '',
            categoryName: '',
            quantity: 0,
            inputPrice: 0,
            salePrice: 0,
            totalPrice: 0
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
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

            const response = await getInputComponentRegisterByDate(startDate, endDate)

            if (!response || !Array.isArray(Object.values(response))) {
                console.warn('Invalid response:', response)
                return
            }

            // Chuyển đổi object thành array
            const responseArray = Object.values(response)

            // Tổng hợp dữ liệu theo componentId và inputPrice
            const aggregatedData = responseArray.reduce((acc, register) => {
                register.details?.forEach((detail) => {
                    const componentId = detail.component?.id
                    const key = `${componentId}-${detail.inputPrice}` // Tạo key duy nhất cho mỗi cặp component-price

                    if (!acc[key]) {
                        acc[key] = {
                            componentId: componentId,
                            componentName: detail.component?.name || 'Unknown',
                            categoryName: detail.component?.category?.name || 'Unknown',
                            quantity: 0,
                            inputPrice: detail.inputPrice || 0,
                            salePrice: detail.component?.price || 0,
                            totalPrice: 0
                        }
                    }

                    // Cộng dồn số lượng và tổng giá trị cho cùng component và cùng giá nhập
                    acc[key].quantity += detail.quantity || 0
                    acc[key].totalPrice += detail.quantity * detail.inputPrice || 0
                })
                return acc
            }, {})

            // Chuyển đổi từ object sang array
            const result = Object.values(aggregatedData)
            setComponentsData(result)

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
            setComponentsData([])
        } finally {
            setIsLoading(false)
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
            <>
                <div className="report-stock__table-container">
                    <p className="report__table-title">
                        Danh sách phụ tùng đã nhập {getDateRangeText(dateRange, selectedDate)}
                    </p>
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <p>Đang tải...</p>
                        </div>
                    ) : (
                        <table className="page-table">
                            <thead>
                                <tr>
                                    <th>Tên phụ tùng</th>
                                    <th>Loại</th>
                                    <th>Số lượng nhập</th>
                                    <th>Giá nhập</th>
                                    <th>Giá bán</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {componentsData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.componentName}</td>
                                        <td>{item.categoryName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.inputPrice?.toLocaleString('vi-VN')}đ</td>
                                        <td>{item.salePrice?.toLocaleString('vi-VN')}đ</td>
                                        <td>{item.totalPrice?.toLocaleString('vi-VN')}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="report-stock__charts">
                    <div
                        className="report-stock__chart-container"
                        style={{ height: '400px', marginBottom: '2rem' }}
                    >
                        {isLoading ? (
                            <div className="d-flex justify-content-center">
                                <p>Đang tải...</p>
                            </div>
                        ) : (
                            <Bar options={chartOptions} data={chartData} />
                        )}
                    </div>
                </div>
            </>
        </div>
    )
}

export default ReportStock
