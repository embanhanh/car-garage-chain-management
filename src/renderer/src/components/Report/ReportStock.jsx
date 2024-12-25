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
import { generateFakeData } from '../../utils/fakeData'
import './Report.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

function ReportStock({ dateRange = 'week', selectedDate = new Date() }) {
    const [partsData, setPartsData] = useState([])
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Số lượng tồn kho',
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
        const fakeData = generateFakeData(dateRange, selectedDate)
        const stockData = fakeData.stock

        setPartsData(stockData)

        // Cập nhật dữ liệu cho biểu đồ cột
        setChartData({
            labels: stockData.map((part) => part.name),
            datasets: [
                {
                    label: 'Số lượng tồn kho',
                    data: stockData.map((part) => part.stock),
                    backgroundColor: 'rgba(53, 162, 235, 0.8)'
                }
            ]
        })

        // Cập nhật dữ liệu cho biểu đồ tròn
        setPieChartData({
            labels: stockData.map((part) => part.name),
            datasets: [
                {
                    data: stockData.map((part) => part.stock),
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
    }, [dateRange, selectedDate])

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Số lượng tồn kho theo phụ tùng'
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
                text: 'Tỷ lệ phụ tùng trong kho'
            }
        }
    }

    return (
        <div className="report-stock">
            {/* Bảng phụ tùng */}
            <div className="report-stock__table-container">
                <h2 className="report-stock__title">Danh sách phụ tùng</h2>
                <table className="report-stock__table">
                    <thead>
                        <tr>
                            <th>Tên phụ tùng</th>
                            <th>Loại</th>
                            <th>Tồn kho</th>
                            <th>Đã sử dụng</th>
                            <th>Giá nhập</th>
                            <th>Giá bán</th>
                            <th>Lợi nhuận</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partsData.map((part) => (
                            <tr key={part.id}>
                                <td>{part.name}</td>
                                <td>{part.category}</td>
                                <td>
                                    <span
                                        className={`stock-status ${
                                            part.stock > 100
                                                ? 'stock-status--high'
                                                : part.stock > 30
                                                  ? 'stock-status--medium'
                                                  : 'stock-status--low'
                                        }`}
                                    >
                                        {part.stock}
                                    </span>
                                </td>
                                <td>{part.used}</td>
                                <td>{part.importPrice.toLocaleString('vi-VN')}đ</td>
                                <td>{part.sellPrice.toLocaleString('vi-VN')}đ</td>
                                <td>
                                    {(
                                        ((part.sellPrice - part.importPrice) / part.importPrice) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Biểu đồ */}
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

export default ReportStock
