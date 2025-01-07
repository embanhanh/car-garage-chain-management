import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import { startOfMonth, endOfMonth } from 'date-fns'
import { getServiceRegisterByGarageId } from '../../controllers/serviceRegisterController'
import { dbService } from '../../services/DatabaseService'

const ReportComponent = forwardRef(({ selectedDate = new Date() }, ref) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    })
    const [detailedData, setDetailedData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const garageId = JSON.parse(localStorage.getItem('currentGarage'))?.id

    const processComponentData = async () => {
        setIsLoading(true)
        try {
            const startDate = startOfMonth(selectedDate)
            const endDate = endOfMonth(selectedDate)

            // Lấy danh sách tất cả phụ tùng
            const components = await dbService.getAll('components', garageId)
            const serviceRegisters = await getServiceRegisterByGarageId(
                garageId,
                startDate,
                endDate
            )

            // Xử lý dữ liệu cho từng phụ tùng
            const componentDetails = components.map((component) => {
                // Tính số lượng sử dụng trong tháng
                const used = serviceRegisters.reduce((sum, register) => {
                    const detail = register.repairRegisters.reduce((sum, repair) => {
                        const componentUsed = repair.repairRegisterComponents.find(
                            (d) => d.component.id === component.id
                        )
                        return sum + (componentUsed?.quantity || 0)
                    }, 0)
                    return sum + detail
                }, 0)

                return {
                    'Tên phụ tùng': component.name,
                    'Danh mục': component.category?.name || 'N/A',
                    'Mô tả': component.description || 'N/A',
                    'Vị trí lưu trữ': component.storagePosition || 'N/A',
                    'Đơn giá': component.price || 0,
                    'Tồn đầu kỳ': component.inventory || 0,
                    'Số lượng đã dùng': used,
                    'Tồn cuối kỳ': component.inventory - used || 0,
                    'Kích thước': component.size || 'N/A',
                    'Trọng lượng': component.weight || 'N/A',
                    'Chất liệu': component.material || 'N/A'
                }
            })

            setDetailedData(componentDetails)

            // Cập nhật dữ liệu biểu đồ
            setChartData({
                labels: componentDetails.map((item) => item['Tên phụ tùng']),
                datasets: [
                    {
                        label: 'Tồn đầu kỳ',
                        data: componentDetails.map((item) => item['Tồn đầu kỳ']),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        borderColor: 'rgb(53, 162, 235)',
                        borderWidth: 1
                    },
                    {
                        label: 'Tồn cuối kỳ',
                        data: componentDetails.map((item) => item['Tồn cuối kỳ']),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1
                    }
                ]
            })
        } catch (error) {
            console.error('Error processing component data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        processComponentData()
    }, [selectedDate])

    useImperativeHandle(ref, () => ({
        exportToExcel: () => {
            try {
                const wb = XLSX.utils.book_new()

                // 1. Tạo worksheet tổng quan
                const summaryData = detailedData.map((item) => ({
                    'Tên phụ tùng': item['Tên phụ tùng'],
                    'Danh mục': item['Danh mục'],
                    'Tồn đầu kỳ': item['Tồn đầu kỳ'],
                    'Số lượng đã dùng': item['Số lượng đã dùng'],
                    'Tồn cuối kỳ': item['Tồn cuối kỳ']
                }))

                const wsSummary = XLSX.utils.json_to_sheet(summaryData)

                // 2. Tạo worksheet chi tiết
                const wsDetailed = XLSX.utils.json_to_sheet(detailedData)

                // Định dạng độ rộng cột
                const summaryColWidths = [
                    { wch: 30 }, // Tên phụ tùng
                    { wch: 20 }, // Danh mục
                    { wch: 15 }, // Tồn đầu kỳ
                    { wch: 15 }, // Số lượng đã dùng
                    { wch: 15 } // Tồn cuối kỳ
                ]

                const detailedColWidths = [
                    { wch: 30 }, // Tên phụ tùng
                    { wch: 20 }, // Danh mục
                    { wch: 40 }, // Mô tả
                    { wch: 15 }, // Vị trí lưu trữ
                    { wch: 15 }, // Đơn giá
                    { wch: 15 }, // Tồn đầu kỳ
                    { wch: 15 }, // Số lượng đã dùng
                    { wch: 15 }, // Tồn cuối kỳ
                    { wch: 15 }, // Kích thước
                    { wch: 15 }, // Trọng lượng
                    { wch: 20 } // Chất liệu
                ]

                wsSummary['!cols'] = summaryColWidths
                wsDetailed['!cols'] = detailedColWidths

                // Định dạng tiền tệ cho cột đơn giá
                const formatCurrency = (value) => {
                    return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(value)
                }

                // Áp dụng định dạng tiền tệ
                const range = XLSX.utils.decode_range(wsDetailed['!ref'])
                for (let row = 2; row <= range.e.r + 1; row++) {
                    const cell = wsDetailed[`F${row}`] // Cột đơn giá
                    if (cell && cell.v) {
                        cell.v = formatCurrency(cell.v)
                        cell.t = 's'
                    }
                }

                // Thêm style cho header
                const headerStyle = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: 'CCCCCC' } },
                    alignment: { horizontal: 'center' }
                }

                // Áp dụng style cho header của cả hai worksheet
                ;[wsSummary, wsDetailed].forEach((ws) => {
                    const range = XLSX.utils.decode_range(ws['!ref'])
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        const address = XLSX.utils.encode_cell({ r: 0, c: C })
                        if (!ws[address]) continue
                        ws[address].s = headerStyle
                    }
                })

                // Thêm các worksheet vào workbook
                XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng quan')
                XLSX.utils.book_append_sheet(wb, wsDetailed, 'Chi tiết phụ tùng')

                // Xuất file
                const fileName = `Bao_cao_phu_tung_${format(selectedDate, 'MM-yyyy')}.xlsx`
                XLSX.writeFile(wb, fileName)
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
                position: 'top'
            },
            title: {
                display: true,
                text: `Báo cáo tồn kho tháng ${format(selectedDate, 'MM/yyyy')}`,
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
                    text: 'Số lượng'
                }
            }
        }
    }

    return (
        <div className="report-stock">
            <div className="report-stock__chart-container" style={{ height: '500px' }}>
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                ) : (
                    <Bar options={chartOptions} data={chartData} />
                )}
            </div>
        </div>
    )
})

export default ReportComponent
