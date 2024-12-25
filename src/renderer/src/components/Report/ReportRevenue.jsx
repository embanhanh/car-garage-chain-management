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
import { format, addDays } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function ReportRevenue({ dateRange, selectedDate }) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] })

    useEffect(() => {
        generateData()
    }, [dateRange, selectedDate])

    const generateData = () => {
        let labels = []
        let revenueData = []
        let costData = []

        if (dateRange === 'year') {
            labels = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]

            for (let i = 0; i < 12; i++) {
                const revenue = Math.floor(Math.random() * 100000) + 50000
                const cost = Math.floor(Math.random() * 50000) + 30000

                revenueData.push(revenue)
                costData.push(cost)
            }
        } else {
            const days = dateRange === 'week' ? 7 : 30
            const currentDate = new Date()

            for (let i = 0; i < days; i++) {
                const date = addDays(currentDate, -i)
                labels.unshift(format(date, 'dd/MM'))

                const revenue = Math.floor(Math.random() * 20000) + 10000
                const cost = Math.floor(Math.random() * 10000) + 5000

                revenueData.unshift(revenue)
                costData.unshift(cost)
            }
        }

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Doanh thu',
                    data: revenueData,
                    backgroundColor: 'rgba(53, 162, 235, 0.8)',
                    stack: 'Stack 0'
                },
                {
                    label: 'Chi phí',
                    data: costData,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    stack: 'Stack 1'
                }
            ]
        })
    }

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Biểu đồ doanh thu và chi phí'
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
            x: {
                stacked: false
            },
            y: {
                stacked: false,
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
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
            <Bar options={options} data={chartData} />
        </div>
    )
}
