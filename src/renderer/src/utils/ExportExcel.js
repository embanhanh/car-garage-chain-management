// const { dialog } = require('electron')
// const ExcelJS = require('exceljs')

// export const exportExcel = async (columns, data, filename = 'thong_ke.xlsx') => {
//     const { canceled, filePath } = await dialog.showSaveDialog({
//         title: 'Lưu tệp Excel',
//         defaultPath: filename,
//         filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
//     })

//     if (canceled || !filePath) return

//     const workbook = new ExcelJS.Workbook()
//     const worksheet = workbook.addWorksheet('Thống kê')

//     worksheet.columns = columns.map((col) => ({
//         header: col.header,
//         key: col.key,
//         width: col.width || 15
//     }))

//     worksheet.getRow(1).font = { bold: true }
//     worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

//     data.forEach((item) => {
//         const row = worksheet.addRow(item)
//         row.alignment = { vertical: 'middle' }
//     })

//     try {
//         await workbook.xlsx.writeFile(filePath)
//         console.log(`Tệp Excel đã được lưu tại: ${filePath}`)
//         return { success: true, filePath }
//     } catch (error) {
//         console.error('Lỗi khi xuất file Excel:', error)
//         return { success: false, error }
//     }
// }
