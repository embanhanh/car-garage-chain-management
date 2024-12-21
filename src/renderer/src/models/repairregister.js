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
        },
        {
            collection: 'services',
            foreignKey: 'serviceId',
            as: 'service'
        },
        {
            collection: 'components',
            foreignKey: 'componentId',
            as: 'component',
            isArray: true,
            arrayPath: 'repairRegisterComponents',
            idField: 'componentId'
        }
    ]
    constructor({
        id = '',
        status = '',
        serviceRegisterId = '',
        serviceRegister = null,
        serviceId = '',
        service = null,
        employeeIds = [],
        employees = [],
        repairRegisterComponents: [],
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.status = status
        this.serviceRegisterId = serviceRegisterId
        this.serviceRegister = serviceRegister
        this.serviceId = serviceId
        this.service = service
        this.employeeIds = employeeIds
        this.employees = employees
        this.repairRegisterComponents = repairRegisterComponents
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            status: this.status,
            serviceRegisterId: this.serviceRegisterId,
            serviceId: this.serviceId,
            employeeIds: this.employeeIds,
            createdAt: this.createdAt,
            repairRegisterComponents: this.repairRegisterComponents.map(
                ({ componentId, quantity }) => ({
                    componentId,
                    quantity
                })
            )
        }
    }

    static fromFirestore(data) {
        return new RepairRegister(data)
    }
}
