export class Brand {
    static relations = []

    constructor({ id = '', name = '', model = '', createdAt = new Date() } = {}) {
        this.id = id
        this.name = name
        this.model = model
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            name: this.name,
            model: this.model,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Brand(data)
    }
}
