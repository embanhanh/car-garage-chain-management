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
import './Report.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

function ReportCustomer({ dateRange = 'week', selectedDate = new Date() }) {
    const [customerData, setCustomerData] = useState([])
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lần sử dụng dịch vụ',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.8)'
            }
        ]
    })

    const [pieChartData, setPieChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }
        ]
    })

    useEffect(() => {
        generateFakeCustomerData()
    }, [dateRange, selectedDate])

    const generateFakeCustomerData = () => {
        // Tạo dữ liệu giả về khách hàng
        const customers = [
            {
                id: 1,
                name: 'Nguyễn Văn A',
                phone: '0901234567',
                visitCount: Math.floor(Math.random() * 20) + 5,
                totalSpent: Math.floor(Math.random() * 20000000) + 5000000,
                lastVisit: '15/03/2024',
                customerType: 'vip',
                favoriteService: 'Bảo dưỡng định kỳ'
            },
            {
                id: 2,
                name: 'Trần Thị B',
                phone: '0912345678',
                visitCount: Math.floor(Math.random() * 15) + 3,
                totalSpent: Math.floor(Math.random() * 15000000) + 3000000,
                lastVisit: '18/03/2024',
                customerType: 'usual',
                favoriteService: 'Thay dầu máy'
            },
            {
                id: 3,
                name: 'Lê Văn C',
                phone: '0923456789',
                visitCount: Math.floor(Math.random() * 10) + 1,
                totalSpent: Math.floor(Math.random() * 10000000) + 1000000,
                lastVisit: '20/03/2024',
                customerType: 'new',
                favoriteService: 'Thay lốp'
            },
            {
                id: 4,
                name: 'Phạm Thị D',
                phone: '0934567890',
                visitCount: Math.floor(Math.random() * 25) + 10,
                totalSpent: Math.floor(Math.random() * 25000000) + 8000000,
                lastVisit: '21/03/2024',
                customerType: 'VIP',
                favoriteService: 'Sửa phanh'
            },
            {
                id: 5,
                name: 'Hoàng Văn E',
                phone: '0945678901',
                visitCount: Math.floor(Math.random() * 8) + 2,
                totalSpent: Math.floor(Math.random() * 8000000) + 2000000,
                lastVisit: '22/03/2024',
                customerType: 'usual',
                favoriteService: 'Bảo dưỡng định kỳ'
            }
        ]

        setCustomerData(customers)

        // Cập nhật dữ liệu cho biểu đồ cột
        setChartData({
            labels: customers.map((customer) => customer.name),
            datasets: [
                {
                    label: 'Số lần sử dụng dịch vụ',
                    data: customers.map((customer) => customer.visitCount),
                    backgroundColor: 'rgba(53, 162, 235, 0.8)'
                }
            ]
        })

        // Cập nhật dữ liệu cho biểu đồ tròn
        const customerTypeCount = customers.reduce((acc, customer) => {
            acc[customer.customerType] = (acc[customer.customerType] || 0) + 1
            return acc
        }, {})

        setPieChartData({
            labels: Object.keys(customerTypeCount),
            datasets: [
                {
                    data: Object.values(customerTypeCount),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)'
                    ]
                }
            ]
        })
    }

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Số lần sử dụng dịch vụ của khách hàng'
            }
        }
    }

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            },
            title: {
                display: true,
                text: 'Phân loại khách hàng'
            }
        }
    }

    return (
        <div className="report-stock">
            {/* <div className="report-stock__table-container">
                <h2 className="report-stock__title">Danh sách khách hàng</h2>
                <table className="report-stock__table">
                    <thead>
                        <tr>
                            <th>Tên khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Loại khách hàng</th>
                            <th>Số lần sử dụng</th>
                            <th>Tổng chi tiêu</th>
                            <th>Lần cuối sử dụng</th>
                            <th>Dịch vụ yêu thích</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerData.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.phone}</td>
                                <td>
                                    <span
                                        className={`customer-type customer-type--${customer.customerType.toLowerCase()}`}
                                    >
                                        {customer.customerType === 'vip'
                                            ? 'VIP'
                                            : customer.customerType === 'usual'
                                              ? 'Thường xuyên'
                                              : 'Mới'}
                                    </span>
                                </td>
                                <td>{customer.visitCount}</td>
                                <td>{customer.totalSpent.toLocaleString('vi-VN')}đ</td>
                                <td>{customer.lastVisit}</td>
                                <td>{customer.favoriteService}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}

            <div className="report-stock__charts">
                <div className="report-stock__chart-container" style={{ height: '400px' }}>
                    <Bar options={barOptions} data={chartData} />
                </div>
                {/* <div className="report-stock__chart-container" style={{ height: '400px' }}>
                    <Pie options={pieOptions} data={pieChartData} />
                </div> */}
            </div>
        </div>
    )
}

export default ReportCustomer
