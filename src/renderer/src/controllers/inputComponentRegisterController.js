import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'

export const getInputComponentRegister = async () => {
    const inputComponentRegister = await dbService.getAll('inputcomponentregisters')
    return inputComponentRegister
}
export const getInputComponentRegisterByDate = async (startDate, endDate) => {
    try {
        const inputComponentRegister = await dbService.getAll('inputcomponentregisters')

        if (!Array.isArray(inputComponentRegister)) {
            console.warn('Không có dữ liệu từ cơ sở dữ liệu.')
            return []
        }

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
