export class InputComponentRegister {
    static relations = [
        {
            collection: 'employees',
            foreignKey: 'employeeId',
            as: 'employee'
        },
        {
            collection: 'suppliers',
            foreignKey: 'supplierId',
            as: 'supplier'
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
        supplierId = '',
        supplier = null,
        createdAt = new Date(),
        garageId = ''
    } = {}) {
        this.id = id
        this.employeeId = employeeId
        this.employee = employee
        this.details = details
        this.createdAt = createdAt
        this.supplierId = supplierId
        this.supplier = supplier
        this.garageId = garageId
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
            supplierId: this.supplierId,
            createdAt: this.createdAt,
            garageId: this.garageId
        }
    }

    static fromFirestore(data) {
        return new InputComponentRegister(data)
    }
}
