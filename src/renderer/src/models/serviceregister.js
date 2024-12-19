export class ServiceRegister {
    static relations = [
        {
            collection: 'services',
            foreignKey: 'serviceIds',
            as: 'services',
            isArray: true
        },
        {
            collection: 'employees',
            foreignKey: 'employeeId',
            as: 'employee'
        },
        {
            collection: 'cars',
            foreignKey: 'carId',
            as: 'car'
        },
        {
            collection: 'components',
            foreignKey: 'componentId',
            as: 'component',
            isArray: true,
            arrayPath: 'details',
            idField: 'componentId'
        }
    ]
    constructor({
        id = '',
        serviceIds = [],
        services = [],
        employeeId = '',
        employee = null,
        carId = '',
        car = null,
        status = '',
        details = [],
        expectedCompletionDate = null,
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.serviceIds = serviceIds
        this.services = services
        this.employeeId = employeeId
        this.employee = employee
        this.carId = carId
        this.car = car
        this.status = status
        this.details = details
        this.expectedCompletionDate = expectedCompletionDate
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            serviceIds: this.serviceIds,
            employeeId: this.employeeId,
            carId: this.carId,
            status: this.status,
            expectedCompletionDate: this.expectedCompletionDate,
            details: this.details.map(({ componentId, quantity }) => ({ componentId, quantity })),
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new ServiceRegister(data)
    }
}
