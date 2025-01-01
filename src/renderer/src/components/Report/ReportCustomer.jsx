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

import { getServiceRegisterByDate } from '../../controllers/serviceRegisterController'
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
    const itemsPerPage = 9 // Số item trên mỗi trang

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

            const response = await getServiceRegisterByDate(startDate, endDate)

            if (Array.isArray(response)) {
                processAndUpdateChartData(response)
            }
        } catch (error) {
            console.error('Error fetching customer data:', error)
            setCustomerData([])
            processAndUpdateChartData([])
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
                text: `Thống kê khách hàng - ${getDateRangeText()}`,
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

    return (
        <div className="report-stock">
            <div className="report-stock__table">
                <p className="report__table-title">
                    Danh sách khách hàng từ {getDateRangeText(dateRange, selectedDate)}
                </p>
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
                            const percentage = ((customer.visitCount / totalVisits) * 100).toFixed(
                                1
                            )
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
                </table>

                {/* Thêm phân trang */}
                <div className="z-pagination">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            <div className="report-stock__charts">
                <div className="report-stock__chart-container" style={{ height: '500px' }}>
                    <Pie options={chartOptions} data={chartData} />
                </div>
            </div>
        </div>
    )
}

export default ReportCustomer
