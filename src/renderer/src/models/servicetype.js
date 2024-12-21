export class ServiceType {
    constructor({ id = '', name = '', description = '', createdAt = new Date() } = {}) {
        this.id = id
        this.name = name
        this.description = description
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new ServiceType(data)
    }
}
