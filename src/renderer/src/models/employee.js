export class Employee {
    static relations = [
        {
            collection: 'garages',
            foreignKey: 'garageId',
            as: 'garage'
        }
    ]
    constructor({
        id = '',
        name = '',
        phone = '',
        email = '',
        address = '',
        identifyCard = '',
        birthday = '',
        position = '',
        gender = '',
        salary = '',
        workHours = '',
        garageId = '',
        garage = null,
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.email = email
        this.address = address
        this.identifyCard = identifyCard
        this.birthday = birthday
        this.position = position
        this.gender = gender
        this.salary = salary
        this.workHours = workHours
        this.garageId = garageId
        this.createdAt = createdAt
        this.garage = garage
    }

    toFirestore() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email,
            address: this.address,
            identifyCard: this.identifyCard,
            birthday: this.birthday,
            position: this.position,
            gender: this.gender,
            salary: this.salary,
            workHours: this.workHours,
            garageId: this.garageId,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Employee(data)
    }
}
