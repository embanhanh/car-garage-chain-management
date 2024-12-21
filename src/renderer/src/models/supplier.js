export class Supplier {
    constructor({ id = '', name = '', phone = '', createdAt = new Date() } = {}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Supplier(data)
    }
}
