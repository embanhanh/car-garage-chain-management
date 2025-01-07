import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'
export const getBills = async () => {
    const bills = await dbService.getAll('bills')
    return bills
}

export const getBillsByGarageId = async (garageId, startDate, endDate) => {
    const bills = await dbService.getAll('bills', garageId)
    const parsedStartDate = new Date(startDate)
    const parsedEndDate = new Date(endDate)
    const filteredBills = bills.filter((bill) => {
        const billDate = parseISO(bill.createdAt)
        return isWithinInterval(billDate, { start: parsedStartDate, end: parsedEndDate })
    })
    return filteredBills
}
