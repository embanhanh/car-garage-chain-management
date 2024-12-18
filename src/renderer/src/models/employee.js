export class Employee {
    constructor({
        id = '',
        name = '',
        phone = '',
        email = '',
        address = '',
        indentifyCard = '',
        birthday = '',
        position = '',
        gender = '',
        salary = '',
        workHours = '',
        garageId = '',
        garage = null
    } = {}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.email = email
        this.address = address
        this.indentifyCard = indentifyCard
        this.birthday = birthday
        this.position = position
        this.gender = gender
        this.salary = salary
        this.workHours = workHours
        this.garageId = garageId
        this.garage = garage
    }

    toFirestore() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email,
            address: this.address,
            indentifyCard: this.indentifyCard,
            birthday: this.birthday,
            position: this.position,
            gender: this.gender,
            salary: this.salary,
            workHours: this.workHours,
            garageId: this.garageId
        }
    }

    static fromFirestore(data) {
        return new Employee(data)
    }
}
