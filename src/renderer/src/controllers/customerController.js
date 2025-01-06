import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'

export const getCustomer = async () => {
    const customer = await dbService.getAll('customers')
    return customer
}

export const getCustomerByDateServiceRegister = async (startDate, endDate) => {
    const serviceRegisters = await dbService.getAll('serviceregisters')
    const parsedStartDate = new Date(startDate)
    const parsedEndDate = new Date(endDate)
    const filteredServiceRegisters = serviceRegisters.filter((register) => {
        const registerDate = parseISO(register.createdAt)
        return isWithinInterval(registerDate, { start: parsedStartDate, end: parsedEndDate })
    })

    const customers = filteredServiceRegisters.map((register) => register.car?.customer)
    return customers
}

export const addCustomer = async (customerData) => {
    try {
        // Lấy tất cả khách hàng để đếm số lượng
        const customers = await dbService.getAll('customers')

        // Tạo ID mới với format KH000N
        const nextNumber = customers.length + 1
        const customerId = `KH${nextNumber.toString().padStart(4, '0')}`
        console.log('check customerId:', customerId)

        // Thêm customer vào database
        const result = await dbService.addWithId('customers', customerId, customerData)
        console.log('check result:', result)
        return result
    } catch (error) {
        console.error('Error in addCustomer:', error)
        throw new Error('Không thể thêm khách hàng mới')
    }
}

export const getCustomerByRepairRegister = async (date) => {
    const repairRegisters = await dbService.getAll('repairregisters')
    const parsedDate = new Date(date)
    const filteredRepairRegisters = repairRegisters.filter((register) => {
        const registerDate = parseISO(register.createdAt)
        return isWithinInterval(registerDate, { start: parsedDate, end: parsedDate })
    })
    return filteredRepairRegisters.map((register) => register.car?.customer)
}
