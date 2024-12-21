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
    constructor({ id = '', details = [], createdAt = new Date() } = {}) {
        this.id = id
        this.details = details
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            details: this.details.map(({ componentId, quantity }) => ({ componentId, quantity })),
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new TrackingRegister(data)
    }
}
