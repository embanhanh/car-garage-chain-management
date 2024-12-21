export class Customer {
    constructor({
        id = '',
        name = '',
        phone = '',
        email = '',
        address = '',
        indentifyCard = '',
        birthday = new Date(),
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.email = email
        this.address = address
        this.indentifyCard = indentifyCard
        this.birthday = birthday
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            email: this.email,
            address: this.address,
            indentifyCard: this.indentifyCard,
            birthday: this.birthday,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Customer(data)
    }
}
