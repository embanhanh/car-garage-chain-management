import { dbService } from '../services/DatabaseService'

export const getServiceType = async () => {
    const serviceType = await dbService.getAll('servicetypes')
    return serviceType
}
