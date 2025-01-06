import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'

export const getEmployee = async () => {
    const employee = await dbService.getAll('employees')
    return employee
}

export const getEmployeeByDate = async (startDate, endDate) => {
    try {
        const employees = await dbService.getAll('employees')

        if (!Array.isArray(employees)) {
            console.warn('Không có dữ liệu từ cơ sở dữ liệu.')
            return []
        }

        const parsedStartDate = new Date(startDate)
        const parsedEndDate = new Date(endDate)

        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            console.error('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.')
            return []
        }

        const filteredEmployees = employees.filter((employee) => {
            try {
                if (!employee?.createdAt) return false

                const employeeDate = parseISO(employee.createdAt)
                return isWithinInterval(employeeDate, {
                    start: parsedStartDate,
                    end: parsedEndDate
                })
            } catch (error) {
                console.warn(`Lỗi xử lý item: ${JSON.stringify(employee)}, lỗi:`, error)
                return false
            }
        })

        return filteredEmployees
    } catch (error) {
        console.error('Error in getEmployeeByDate:', error)
        return []
    }
}

export const addEmployee = async (employeeData) => {
    try {
        // Lấy tất cả nhân viên để đếm số lượng
        const employees = await dbService.getAll('employees')

        // Tạo ID mới với format NV000N
        const nextNumber = employees.length + 1
        const employeeId = `NV${nextNumber.toString().padStart(4, '0')}`
        console.log('check employeeId:', employeeId)

        // Thêm các trường cần thiết
        const dataToAdd = {
            ...employeeData,
            id: employeeId,
            createdAt: new Date().toISOString(),
            isDeleted: false,
            status: employeeData.status || 'Đang làm việc'
        }

        // Thêm vào database
        const result = await dbService.addWithId('employees', employeeId, dataToAdd)
        console.log('check result:', result)
        return result
    } catch (error) {
        console.error('Error in addEmployee:', error)
        throw new Error('Không thể thêm nhân viên mới')
    }
}

export const updateEmployee = async (employeeId, employeeData) => {
    const updatedEmployee = await dbService.update('employees', employeeId, employeeData)
    return updatedEmployee
}
