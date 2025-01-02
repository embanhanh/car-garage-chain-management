import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'

export const getServiceRegister = async () => {
    const serviceRegister = await dbService.getAll('serviceregisters')
    return serviceRegister
}

export const getServiceRegisterByDate = async (startDate, endDate) => {
    try {
        const serviceRegisters = await dbService.getAll('serviceregisters')

        if (!Array.isArray(serviceRegisters)) {
            console.warn('Không có dữ liệu từ cơ sở dữ liệu.')
            return []
        }

        const parsedStartDate = new Date(startDate)
        const parsedEndDate = new Date(endDate)

        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            console.error('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.')
            return []
        }

        const filteredServiceRegisters = serviceRegisters.filter((register) => {
            try {
                if (!register?.createdAt) return false

                const registerDate = parseISO(register.createdAt)
                return isWithinInterval(registerDate, {
                    start: parsedStartDate,
                    end: parsedEndDate
                })
            } catch (error) {
                console.warn(`Lỗi xử lý item: ${JSON.stringify(register)}, lỗi:`, error)
                return false
            }
        })

        return filteredServiceRegisters
    } catch (error) {
        console.error('Error in getServiceRegisterByDate:', error)
        return []
    }
}

export const addServiceRegister = async (serviceRegisterData) => {
    try {
        // Lấy tất cả service registers để đếm số lượng
        const registers = await dbService.getAll('serviceregisters')

        // Tạo ID mới với format SR000N
        const nextNumber = registers.length + 1
        const registerId = `SR${nextNumber.toString().padStart(4, '0')}`
        console.log('check registerId:', registerId)

        // Thêm các trường cần thiết
        const dataToAdd = {
            ...serviceRegisterData,
            id: registerId,
            createdAt: new Date().toISOString(),
            isDeleted: false,
            status: serviceRegisterData.status || 'Đang sửa chữa',
            repairRegisterIds: serviceRegisterData.repairRegisterIds || [],
            totalCost: serviceRegisterData.totalCost || 0
        }

        // Thêm vào database
        const result = await dbService.addWithId('serviceregisters', registerId, dataToAdd)
        console.log('check result:', result)
        return result
    } catch (error) {
        console.error('Error in addServiceRegister:', error)
        throw new Error('Không thể thêm phiếu dịch vụ')
    }
}
