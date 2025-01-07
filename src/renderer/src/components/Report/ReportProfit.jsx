import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Pie } from 'react-chartjs-2'
import * as XLSX from 'xlsx'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { getBillsByGarageId } from '../../controllers/billController'
import { getInputComponentRegisterByGarageId } from '../../controllers/inputComponentRegisterController'
import { dbService } from '../../services/DatabaseService'

const ReportProfit = forwardRef(({ selectedDate = new Date() }, ref) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }
        ]
    })
    const [detailedData, setDetailedData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const processGarageData = async () => {
        setIsLoading(true)
        try {
            // Lấy danh sách tất cả garage
            const garages = await dbService.getAll('garages')
            const garageData = []
            const startDate = startOfMonth(selectedDate)
            const endDate = endOfMonth(selectedDate)

            // Tính toán doanh thu và lợi nhuận cho từng garage
            for (const garage of garages) {
                const bills = await getBillsByGarageId(garage.id, startDate, endDate)
                const inputs = await getInputComponentRegisterByGarageId(
                    garage.id,
                    startDate,
                    endDate
                )

                const revenue = bills.reduce((sum, bill) => sum + (bill.total || 0), 0)
                const cost = inputs.reduce((sum, input) => sum + (input.total || 0), 0)
                const profit = revenue - cost

                garageData.push({
                    'Tên garage': garage.name,
                    'Địa chỉ': garage.address,
                    'Số điện thoại': garage.phone,
                    'Doanh thu': revenue,
                    'Chi phí': cost,
                    'Lợi nhuận': profit,
                    'Tỷ suất lợi nhuận (%)': revenue ? ((profit / revenue) * 100).toFixed(2) : 0
                })
            }

            // Sắp xếp theo lợi nhuận giảm dần
            garageData.sort((a, b) => b['Lợi nhuận'] - a['Lợi nhuận'])

            setDetailedData(garageData)

            // Cập nhật dữ liệu biểu đồ
            setChartData({
                labels: garageData.map((item) => item['Tên garage']),
                datasets: [
                    {
                        data: garageData.map((item) => item['Lợi nhuận']),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            })
        } catch (error) {
            console.error('Error processing garage data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        processGarageData()
    }, [selectedDate])

    useImperativeHandle(ref, () => ({
        exportToExcel: () => {
            try {
                const wb = XLSX.utils.book_new()

                // Tạo worksheet chi tiết
                const wsDetailed = XLSX.utils.json_to_sheet(detailedData)

                // Tính tổng
                const totals = detailedData.reduce(
                    (acc, curr) => ({
                        'Tên garage': 'Tổng cộng',
                        'Địa chỉ': '',
                        'Số điện thoại': '',
                        'Doanh thu': acc['Doanh thu'] + curr['Doanh thu'],
                        'Chi phí': acc['Chi phí'] + curr['Chi phí'],
                        'Lợi nhuận': acc['Lợi nhuận'] + curr['Lợi nhuận'],
                        'Tỷ suất lợi nhuận (%)': ''
                    }),
                    { 'Doanh thu': 0, 'Chi phí': 0, 'Lợi nhuận': 0 }
                )

                // Thêm dòng tổng vào cuối
                XLSX.utils.sheet_add_json(wsDetailed, [totals], {
                    skipHeader: true,
                    origin: -1
                })

                // Định dạng độ rộng cột
                const colWidths = [
                    { wch: 30 }, // Tên garage
                    { wch: 40 }, // Địa chỉ
                    { wch: 15 }, // Số điện thoại
                    { wch: 20 }, // Doanh thu
                    { wch: 20 }, // Chi phí
                    { wch: 20 }, // Lợi nhuận
                    { wch: 20 } // Tỷ suất lợi nhuận
                ]

                wsDetailed['!cols'] = colWidths

                // Định dạng tiền tệ
                const formatCurrency = (value) => {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(value)
                }

                // Áp dụng định dạng
                const range = XLSX.utils.decode_range(wsDetailed['!ref'])
                for (let row = 2; row <= range.e.r + 1; row++) {
                    // Định dạng cột tiền tệ
                    ;['D', 'E', 'F'].forEach((col) => {
                        const cell = wsDetailed[`${col}${row}`]
                        if (cell && typeof cell.v === 'number') {
                            cell.v = formatCurrency(cell.v)
                            cell.t = 's'
                        }
                    })

                    // Định dạng cột phần trăm
                    const percentCell = wsDetailed[`G${row}`]
                    if (percentCell && typeof percentCell.v === 'number') {
                        percentCell.v = `${percentCell.v}%`
                        percentCell.t = 's'
                    }
                }

                // Thêm style cho header
                const headerStyle = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: 'CCCCCC' } },
                    alignment: { horizontal: 'center' }
                }

                // Áp dụng style cho header
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    const address = XLSX.utils.encode_cell({ r: 0, c: C })
                    if (!wsDetailed[address]) continue
                    wsDetailed[address].s = headerStyle
                }

                // Thêm worksheet vào workbook
                XLSX.utils.book_append_sheet(wb, wsDetailed, 'Tỷ lệ lợi nhuận')

                // Xuất file
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
                const blob = new Blob([wbout], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })

                const url = window.URL.createObjectURL(blob)
                const fileName = `Bao_cao_ty_le_loi_nhuan_${format(selectedDate, 'yyyy')}.xlsx`

                const a = document.createElement('a')
                a.href = url
                a.download = fileName
                document.body.appendChild(a)
                a.click()

                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } catch (error) {
                console.error('Error exporting to Excel:', error)
                alert('Có lỗi khi xuất file Excel')
            }
        }
    }))

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            },
            title: {
                display: true,
                text: `Tỷ lệ lợi nhuận giữa các garage năm ${format(selectedDate, 'yyyy')}`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        }
    }

    return (
        <div className="report-profit">
            <div className="report-profit__chart-container" style={{ height: '500px' }}>
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                ) : (
                    <Pie options={chartOptions} data={chartData} />
                )}
            </div>
        </div>
    )
})

export default ReportProfit
