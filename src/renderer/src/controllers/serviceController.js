import { dbService } from '../services/DatabaseService'

export const getService = async () => {
    const service = await dbService.getAll('services')
    return service
}

export const addService = async (service) => {
    const newService = await dbService.add('services', service)
    return newService
}
