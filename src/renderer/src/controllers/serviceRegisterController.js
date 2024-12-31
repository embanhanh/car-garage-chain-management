import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'

export const getRepairRegisterByDate = async (startDate, endDate) => {
    try {
        // Lấy tất cả service registers với relations đã được populate
        const serviceRegisters = await dbService.findBy('serviceregisters', [], {
            populate: [
                {
                    foreignKey: 'carId',
                    collection: 'cars',
                    relations: [
                        {
                            foreignKey: 'customerId',
                            collection: 'customers'
                        }
                    ]
                }
            ]
        })

        const parsedStartDate = new Date(startDate)
        const parsedEndDate = new Date(endDate)

        // Lọc các phiếu sửa chữa trong khoảng thời gian
        const filteredServiceRegisters = serviceRegisters.filter((register) => {
            const registerDate = parseISO(register.createdAt)
            return isWithinInterval(registerDate, {
                start: parsedStartDate,
                end: parsedEndDate
            })
        })

        // Thêm thông tin chi tiết cho mỗi phiếu
        const detailedRegisters = await Promise.all(
            filteredServiceRegisters.map(async (register) => {
                return {
                    ...register,
                    repairRegisterComponents: register.repairRegisterComponents || [],
                    employees: register.employees || [],
                    service: register.service || {},
                    car: register.car || {},
                    customer: register.car?.customer || {}
                }
            })
        )

        console.log('Filtered service registers with car and customer:', detailedRegisters)
        return detailedRegisters
    } catch (error) {
        console.error('Error in getRepairRegisterByDate:', error)
        throw error
    }
}

export const getCustomerByServiceRegister = async (startDate, endDate) => {
    try {
        // Lấy service registers với car và customer đã được populate
        const serviceRegisters = await dbService.findBy('serviceregisters', [], {
            populate: [
                {
                    foreignKey: 'carId',
                    collection: 'cars',
                    relations: [
                        {
                            foreignKey: 'customerId',
                            collection: 'customers'
                        }
                    ]
                }
            ]
        })

        const parsedStartDate = new Date(startDate)
        const parsedEndDate = new Date(endDate)

        const filteredServiceRegisters = serviceRegisters.filter((register) => {
            const registerDate = parseISO(register.createdAt)
            return isWithinInterval(registerDate, {
                start: parsedStartDate,
                end: parsedEndDate
            })
        })

        // Lấy thông tin khách hàng từ car đã được populate
        const customers = filteredServiceRegisters
            .map((register) => register.car?.customer)
            .filter((customer) => customer) // Lọc bỏ các giá trị null/undefined

        // Loại bỏ các khách hàng trùng lặp dựa trên ID
        const uniqueCustomers = Array.from(
            new Map(customers.map((customer) => [customer.id, customer])).values()
        )

        console.log('Filtered unique customers:', uniqueCustomers)
        return uniqueCustomers
    } catch (error) {
        console.error('Error in getCustomerByServiceRegister:', error)
        throw error
    }
}
