import { dbService } from '../services/DatabaseService'

export const getCustomer = async () => {
    const customer = await dbService.getAll('customers')
    return customer
}

export const getCustomerByRepairRegister = async (repairRegisterId) => {
    const customer = await dbService.get('customers', repairRegisterId)
    return customer
}
