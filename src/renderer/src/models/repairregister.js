export class RepairRegister {
    static relations = [
        {
            collection: 'employees',
            foreignKey: 'employeeIds',
            as: 'employees',
            isArray: true
        },
        {
            collection: 'serviceregisters',
            foreignKey: 'serviceRegisterId',
            as: 'serviceRegister'
        }
    ]
    constructor({
        id = '',
        status = '',
        serviceRegisterId = '',
        serviceRegister = null,
        employeeIds = [],
        employees = [],
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.status = status
        this.serviceRegisterId = serviceRegisterId
        this.serviceRegister = serviceRegister
        this.employeeIds = employeeIds
        this.employees = employees
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            status: this.status,
            serviceRegisterId: this.serviceRegisterId,
            employeeIds: this.employeeIds,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new RepairRegister(data)
    }
}
