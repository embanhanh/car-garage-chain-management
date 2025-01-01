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
