import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'

export const getInputComponentRegister = async () => {
    const inputComponentRegister = await dbService.getAll('inputcomponentregisters')
    return inputComponentRegister
}

export const getInputComponentRegisterByGarageId = async (garageId, startDate, endDate) => {
    try {
        const inputComponentRegister = await dbService.getAll('inputcomponentregisters', garageId)

        if (!Array.isArray(inputComponentRegister)) {
            console.warn('Không có dữ liệu từ cơ sở dữ liệu.')
            return []
        }

        console.log('check inputComponentRegister:', startDate, endDate)
        const parsedStartDate = new Date(startDate)
        const parsedEndDate = new Date(endDate)

        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            console.error('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.')
            return []
        }

        const filteredData = inputComponentRegister.filter((item) => {
            try {
                if (!item?.createdAt) return false

                const itemDate = parseISO(item.createdAt)
                return isWithinInterval(itemDate, {
                    start: parsedStartDate,
                    end: parsedEndDate
                })
            } catch (error) {
                console.warn(`Lỗi xử lý item: ${JSON.stringify(item)}, lỗi:`, error)
                return false
            }
        })

        return filteredData
    } catch (error) {
        console.error('Lỗi trong getInputComponentRegisterByDate:', error)
        return []
    }
}

export const addInputComponentRegister = async (inputComponentRegisterData) => {
    try {
        // Lấy tất cả input component registers để đếm số lượng
        const registers = await dbService.getAll('inputcomponentregisters')

        // Tạo ID mới với format CR000N
        const nextNumber = registers.length + 1
        const registerId = `CR${nextNumber.toString().padStart(4, '0')}`
        console.log('check registerId:', registerId)

        // Thêm các trường cần thiết
        const dataToAdd = {
            ...inputComponentRegisterData,
            id: registerId,
            createdAt: new Date().toISOString(),
            isDeleted: false
        }

        // Thêm vào database
        const result = await dbService.addWithId('inputcomponentregisters', registerId, dataToAdd)
        console.log('check result:', result)
        return result
    } catch (error) {
        console.error('Error in addInputComponentRegister:', error)
        throw new Error('Không thể thêm phiếu nhập linh kiện')
    }
}
