export class TrackingRegister {
    static relations = [
        {
            collection: 'components',
            foreignKey: 'componentId',
            as: 'component',
            isArray: true,
            arrayPath: 'details',
            idField: 'componentId'
        }
    ]
    constructor({ id = '', details = [], createdAt = new Date(), garageId = '' } = {}) {
        this.id = id
        this.details = details
        this.createdAt = createdAt
        this.garageId = garageId
    }

    toFirestore() {
        return {
            id: this.id,
            details: this.details.map(({ componentId, quantity }) => ({ componentId, quantity })),
            createdAt: this.createdAt,
            garageId: this.garageId
        }
    }

    static fromFirestore(data) {
        return new TrackingRegister(data)
    }
}
