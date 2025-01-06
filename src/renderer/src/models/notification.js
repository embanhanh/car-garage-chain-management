export class Notification {
    static relations = []
    constructor({ id = '', title = '', content = '', garageId = '', createdAt = new Date() } = {}) {
        this.id = id
        this.title = title
        this.content = content
        this.garageId = garageId
        this.createdAt = createdAt
    }
    toFirestore() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            garageId: this.garageId,
            createdAt: this.createdAt
        }
    }
    static fromFirestore(data) {
        return new Notification(data)
    }
}
