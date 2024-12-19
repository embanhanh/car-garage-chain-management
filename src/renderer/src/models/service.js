export class Service {
    static relations = [
        {
            collection: 'servicetypes',
            foreignKey: 'serviceTypeId',
            as: 'serviceType'
        }
    ]
    constructor({
        id = '',
        name = '',
        description = '',
        price = 0,
        duration = 0,
        serviceTypeId = '',
        serviceType = null,
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.duration = duration
        this.serviceTypeId = serviceTypeId
        this.serviceType = serviceType
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            duration: this.duration,
            serviceTypeId: this.serviceTypeId,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Service(data)
    }
}
