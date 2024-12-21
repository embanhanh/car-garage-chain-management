export class Category {
    constructor({ id = '', name = '', createdAt = new Date() } = {}) {
        this.id = id
        this.name = name
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Category(data)
    }
}
