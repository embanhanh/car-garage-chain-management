export class Brand {
    constructor({ id = '', name = '', model = [], createdAt = new Date() } = {}) {
        this.id = id
        this.name = name
        this.model = model
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            model: this.model,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Brand({
            id: data.id,
            name: data.name,
            model: data.model,
            createdAt: data.createdAt
        })
    }
}
