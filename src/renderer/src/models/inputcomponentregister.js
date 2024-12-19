export class InputComponentRegister {
    static relations = [
        {
            collection: 'employees',
            foreignKey: 'employeeId',
            as: 'employee'
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
        employeeId = '',
        employee = null,
        details = [],
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.employeeId = employeeId
        this.employee = employee
        this.details = details
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            employeeId: this.employeeId,
            details: this.details.map(({ componentId, quantity, inputPrice }) => ({
                componentId,
                quantity,
                inputPrice
            })),
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new InputComponentRegister(data)
    }
}
