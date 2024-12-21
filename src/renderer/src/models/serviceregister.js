export class ServiceRegister {
    static relations = [
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
            collection: 'repairregisters',
            foreignKey: 'repairRegisterIds',
            as: 'repairRegisters',
            isArray: true
        }
    ]
    constructor({
        id = '',
        carId = '',
        car = null,
        employeeId = '',
        employee = null,
        status = '',
        repairRegisterIds = [],
        repairRegisters = [],
        expectedCompletionDate = null,
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.employeeId = employeeId
        this.employee = employee
        this.carId = carId
        this.car = car
        this.status = status
        this.repairRegisterIds = repairRegisterIds
        this.repairRegisters = repairRegisters
        this.expectedCompletionDate = expectedCompletionDate
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            employeeId: this.employeeId,
            carId: this.carId,
            status: this.status,
            expectedCompletionDate: this.expectedCompletionDate,
            repairRegisterIds: this.repairRegisterIds,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new ServiceRegister(data)
    }
}
