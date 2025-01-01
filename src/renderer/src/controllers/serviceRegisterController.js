import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'

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
        console.error('Error in getRepairRegisterByDate:', error)
        throw error
    }
}
