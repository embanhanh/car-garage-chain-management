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
import { format, addDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns'
import './Report.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function ReportRepair({ dateRange = 'week', selectedDate = new Date() }) {
    const [repairData, setRepairData] = useState([])
    const [statusChartData, setStatusChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng phiếu',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.8)'
            }
        ]
    })

    const [monthlyChartData, setMonthlyChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng phiếu',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.8)',
                yAxisID: 'y'
            },
            {
                label: 'Tổng chi phí (triệu đồng)',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                yAxisID: 'y1'
            }
        ]
    })

    useEffect(() => {
        generateFakeRepairData()
    }, [dateRange, selectedDate])

    const generateFakeRepairData = () => {
        // Tạo dữ liệu giả về phiếu sửa chữa
        const repairs = []

        // Tạo dữ liệu dựa trên dateRange
        const getRandomRepair = (date) => ({
            id: `PSC${repairs.length + 1}`.padStart(6, '0'),
            customerName: `Khách hàng ${repairs.length + 1}`,
            status: Math.random() > 0.5 ? 'Đã hoàn thành' : 'Đang chờ',
            totalCost: Math.floor(Math.random() * 5000000) + 1000000,
            profit: Math.floor(Math.random() * 1000000) + 300000,
            completionTime: format(date, 'yyyy-MM-dd HH:mm'),
            services: ['Bảo dưỡng định kỳ', 'Thay dầu máy'],
            mechanic: 'Nhân viên ' + (repairs.length + 1)
        })

        // Tạo dữ liệu theo khoảng thời gian
        switch (dateRange) {
            case 'week':
                // Tạo dữ liệu cho 7 ngày
                for (let i = 0; i < 7; i++) {
                    const date = addDays(startOfWeek(selectedDate), i)
                    const dailyRepairCount = Math.floor(Math.random() * 3) + 1 // 1-3 phiếu mỗi ngày
                    for (let j = 0; j < dailyRepairCount; j++) {
                        repairs.push(getRandomRepair(date))
                    }
                }
                break

            case 'month':
                // Tạo dữ liệu cho 30 ngày
                for (let i = 0; i < 30; i++) {
                    const date = addDays(startOfMonth(selectedDate), i)
                    const dailyRepairCount = Math.floor(Math.random() * 4) + 2 // 2-5 phiếu mỗi ngày
                    for (let j = 0; j < dailyRepairCount; j++) {
                        repairs.push(getRandomRepair(date))
                    }
                }
                break

            case 'year':
                // Tạo dữ liệu cho 12 tháng
                for (let month = 0; month < 12; month++) {
                    const daysInMonth = Math.floor(Math.random() * 50) + 30 // 30-80 phiếu mỗi tháng
                    for (let i = 0; i < daysInMonth; i++) {
                        const date = addDays(startOfYear(selectedDate), month * 30 + i)
                        repairs.push(getRandomRepair(date))
                    }
                }
                break
        }

        setRepairData(repairs)

        // Cập nhật dữ liệu cho biểu đồ trạng thái
        const statusCount = repairs.reduce((acc, repair) => {
            acc[repair.status] = (acc[repair.status] || 0) + 1
            return acc
        }, {})

        setStatusChartData({
            labels: Object.keys(statusCount),
            datasets: [
                {
                    label: 'Số lượng phiếu',
                    data: Object.values(statusCount),
                    backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 206, 86, 0.8)']
                }
            ]
        })

        // Cập nhật dữ liệu cho biểu đồ theo thời gian
        let timeLabels = []
        let timeData = new Map()

        switch (dateRange) {
            case 'week':
                // Nhóm theo ngày trong tuần
                timeLabels = Array.from({ length: 7 }, (_, i) =>
                    format(addDays(startOfWeek(selectedDate), i), 'dd/MM')
                )
                repairs.forEach((repair) => {
                    const day = format(new Date(repair.completionTime), 'dd/MM')
                    if (!timeData.has(day)) {
                        timeData.set(day, { count: 0, cost: 0 })
                    }
                    const data = timeData.get(day)
                    data.count++
                    data.cost += repair.totalCost / 1000000
                })
                break

            case 'month':
                // Nhóm theo tuần trong tháng
                timeLabels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5']
                repairs.forEach((repair) => {
                    const date = new Date(repair.completionTime)
                    const week = Math.ceil(date.getDate() / 7)
                    if (!timeData.has(week)) {
                        timeData.set(week, { count: 0, cost: 0 })
                    }
                    const data = timeData.get(week)
                    data.count++
                    data.cost += repair.totalCost / 1000000
                })
                break

            case 'year':
                // Nhóm theo tháng
                timeLabels = [
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
                repairs.forEach((repair) => {
                    const month = new Date(repair.completionTime).getMonth()
                    if (!timeData.has(month)) {
                        timeData.set(month, { count: 0, cost: 0 })
                    }
                    const data = timeData.get(month)
                    data.count++
                    data.cost += repair.totalCost / 1000000
                })
                break
        }

        const timeSeriesData = timeLabels.map((label, index) => {
            const data = timeData.get(
                dateRange === 'month' ? index + 1 : dateRange === 'year' ? index : label
            ) || { count: 0, cost: 0 }
            return data
        })

        setMonthlyChartData({
            labels: timeLabels,
            datasets: [
                {
                    label: 'Số lượng phiếu',
                    data: timeSeriesData.map((d) => d.count),
                    backgroundColor: 'rgba(53, 162, 235, 0.8)',
                    yAxisID: 'y'
                },
                {
                    label: 'Tổng chi phí (triệu đồng)',
                    data: timeSeriesData.map((d) => d.cost),
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    yAxisID: 'y1'
                }
            ]
        })
    }

    const statusOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Số lượng phiếu theo trạng thái'
            }
        }
    }

    const monthlyOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Thống kê phiếu sửa chữa theo tháng'
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Số lượng phiếu'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Tổng chi phí (triệu đồng)'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }

    return (
        <div className="report-stock">
            {/* <div className="report-stock__table-container">
                <h2 className="report-stock__title">Danh sách phiếu sửa chữa</h2>
                <table className="report-stock__table">
                    <thead>
                        <tr>
                            <th>Mã phiếu</th>
                            <th>Khách hàng</th>
                            <th>Trạng thái</th>
                            <th>Tổng chi phí</th>
                            <th>Lợi nhuận</th>
                            <th>Thời gian hoàn thành</th>
                            <th>Dịch vụ</th>
                            <th>Nhân viên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairData.map((repair) => (
                            <tr key={repair.id}>
                                <td>{repair.id}</td>
                                <td>{repair.customerName}</td>
                                <td>
                                    <span
                                        className={`status-badge status-badge--${repair.status.toLowerCase().replace(' ', '-')}`}
                                    >
                                        {repair.status}
                                    </span>
                                </td>
                                <td>{repair.totalCost.toLocaleString('vi-VN')}đ</td>
                                <td>{repair.profit.toLocaleString('vi-VN')}đ</td>
                                <td>
                                    {format(new Date(repair.completionTime), 'dd/MM/yyyy HH:mm')}
                                </td>
                                <td>{repair.services.join(', ')}</td>
                                <td>{repair.mechanic}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}

            <div className="report-stock__charts">
                <div className="report-stock__chart-container" style={{ height: '400px' }}>
                    <Bar options={statusOptions} data={statusChartData} />
                </div>
                <div className="report-stock__chart-container" style={{ height: '400px' }}>
                    <Bar options={monthlyOptions} data={monthlyChartData} />
                </div>
            </div>
        </div>
    )
}

export default ReportRepair
