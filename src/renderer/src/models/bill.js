export class Bill {
    static relations = [
        {
            collection: 'customers',
            foreignKey: 'customerId',
            as: 'customer'
        },
        {
            collection: 'serviceregisters',
            foreignKey: 'serviceRegisterId',
            as: 'serviceRegister'
        },
        {
            collection: 'employees',
            foreignKey: 'employeeId',
            as: 'employee'
        }
    ]
    constructor({
        id = '',
        employeeId = '',
        employee = null,
        customerId = '',
        customer = null,
        total = 0,
        serviceRegisterId = '',
        serviceRegister = null,
        status = '',
        type = '',
        garageId = '',
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.employeeId = employeeId
        this.employee = employee
        this.customerId = customerId
        this.customer = customer
        this.total = total
        this.serviceRegisterId = serviceRegisterId
        this.serviceRegister = serviceRegister
        this.status = status
        this.type = type
        this.createdAt = createdAt
        this.garageId = garageId
    }

    toFirestore() {
        return {
            id: this.id,
            employeeId: this.employeeId,
            customerId: this.customerId,
            total: this.total,
            serviceRegisterId: this.serviceRegisterId,
            status: this.status,
            type: this.type,
            createdAt: this.createdAt,
            garageId: this.garageId
        }
    }

    static fromFirestore(data) {
        return new Bill(data)
    }
}
