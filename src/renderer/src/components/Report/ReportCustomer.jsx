import React, { useEffect, useState } from 'react'
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
import { getCustomerByServiceRegister } from '../../controllers/serviceRegisterController'
import './Report.css'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

function ReportCustomer({ dateRange = 'week', selectedDate = new Date() }) {
    const [customerData, setCustomerData] = useState([])
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

    const getDateRangeText = () => {
        switch (dateRange) {
            case 'week':
                const weekNumber = getWeek(selectedDate, { weekStartsOn: 1 })
                return `Tuần ${weekNumber}, ${format(selectedDate, 'yyyy')}`
            case 'month':
                return format(selectedDate, 'MM/yyyy')
            case 'year':
                return format(selectedDate, 'yyyy')
            default:
                return ''
        }
    }

    const processAndUpdateChartData = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            setChartData({
                labels: ['Không có dữ liệu'],
                datasets: [
                    {
                        data: [1],
                        backgroundColor: ['#e0e0e0'],
                        borderColor: ['#cccccc'],
                        borderWidth: 1
                    }
                ]
            })
            return
        }

        // Tính toán số lần sử dụng dịch vụ cho mỗi khách hàng
        const customerVisits = data.reduce((acc, customer) => {
            acc[customer.name] = (acc[customer.name] || 0) + 1
            return acc
        }, {})

        setChartData({
            labels: Object.keys(customerVisits),
            datasets: [
                {
                    data: Object.values(customerVisits),
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

            console.log('Fetching data for:', { dateRange, startDate, endDate })
            const response = await getCustomerByServiceRegister(startDate, endDate)
            console.log('Fetched customers:', response)

            if (Array.isArray(response)) {
                setCustomerData(response)
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
                        const label = context.label || ''
                        const value = context.raw || 0
                        const total = context.dataset.data.reduce((a, b) => a + b, 0)
                        const percentage = ((value / total) * 100).toFixed(1)
                        return `${label}: ${value} lần (${percentage}%)`
                    }
                }
            }
        }
    }

    return (
        <div className="report-stock">
            <div className="report-stock__charts">
                <div className="report-stock__chart-container" style={{ height: '500px' }}>
                    <Pie options={chartOptions} data={chartData} />
                </div>
                <div className="report-stock__summary">
                    <h3>Tổng số khách hàng: {customerData.length}</h3>
                    <p>Thời gian: {getDateRangeText()}</p>
                </div>
            </div>
        </div>
    )
}

export default ReportCustomer
