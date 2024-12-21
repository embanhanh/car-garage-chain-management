export class Car {
    static relations = [
        {
            collection: 'customers',
            foreignKey: 'customerId',
            as: 'customer'
        }
    ]

    constructor({
        id = '',
        licensePlate = '',
        brand = '',
        model = '',
        engine = '',
        chassis = '',
        manufacturingYear = '',
        customerId = '',
        customer = null,
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.licensePlate = licensePlate
        this.brand = brand
        this.model = model
        this.engine = engine
        this.chassis = chassis
        this.manufacturingYear = manufacturingYear
        this.customerId = customerId
        this.customer = customer
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            licensePlate: this.licensePlate,
            brand: this.brand,
            model: this.model,
            engine: this.engine,
            chassis: this.chassis,
            manufacturingYear: this.manufacturingYear,
            customerId: this.customerId,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Car(data)
    }
}
