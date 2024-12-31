import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import {
    startOfWeek,
    startOfMonth,
    startOfYear,
    endOfWeek,
    endOfMonth,
    endOfYear,
    format,
    getWeek
} from 'date-fns'
import { getRepairRegisterByDate } from '../../controllers/repairController'
import './Report.css'

ChartJS.register(ArcElement, Tooltip, Legend)

function ReportRepair({ dateRange = 'week', selectedDate = new Date() }) {
    const [repairData, setRepairData] = useState([])
    const [statusChartData, setStatusChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)', // Hoàn thành
                    'rgba(255, 206, 86, 0.8)', // Đang sửa chữa
                    'rgba(255, 99, 132, 0.8)', // Khác
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
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
            setStatusChartData({
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

        const statusCount = data.reduce((acc, repair) => {
            const status = repair.status || 'Không xác định'
            acc[status] = (acc[status] || 0) + 1
            return acc
        }, {})

        setStatusChartData({
            labels: Object.keys(statusCount),
            datasets: [
                {
                    data: Object.values(statusCount),
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)', // Hoàn thành
                        'rgba(255, 206, 86, 0.8)', // Đang sửa chữa
                        'rgba(255, 99, 132, 0.8)', // Khác
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        })
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

            const response = await getRepairRegisterByDate(startDate, endDate)

            if (Array.isArray(response)) {
                setRepairData(response)
                processAndUpdateChartData(response)
            }
        } catch (error) {
            console.error('Error fetching repair data:', error)
            setRepairData([])
            processAndUpdateChartData([])
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
                text: `Thống kê phiếu sửa chữa - ${getDateRangeText()}`,
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
                        return `${label}: ${value} phiếu (${percentage}%)`
                    }
                }
            }
        }
    }

    return (
        <div className="report-stock">
            <div className="report-stock__charts">
                <div className="report-stock__chart-container" style={{ height: '500px' }}>
                    <Pie options={chartOptions} data={statusChartData} />
                </div>
                <div className="report-stock__summary">
                    <h3>Tổng số phiếu: {repairData.length}</h3>
                    <p>Thời gian: {getDateRangeText()}</p>
                </div>
            </div>
        </div>
    )
}

export default ReportRepair
