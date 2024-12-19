export class Garage {
    static relations = [
        {
            collection: 'employees',
            foreignKey: 'managerId',
            as: 'manager'
        }
    ]
    constructor({
        id = '',
        name = '',
        address = '',
        phone = '',
        createdAt = new Date(),
        managerId = '',
        manager = null
    } = {}) {
        this.id = id
        this.name = name
        this.address = address
        this.phone = phone
        this.createdAt = createdAt
        this.managerId = managerId
        this.manager = manager
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            phone: this.phone,
            createdAt: this.createdAt,
            managerId: this.managerId
        }
    }

    static fromFirestore(data) {
        return new Garage(data)
    }
}
