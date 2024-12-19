export class Car {
    static relations = [
        {
            collection: 'customers',
            foreignKey: 'customerId',
            as: 'customer'
        }
    ]

    constructor({
        licensePlate = '',
        brand = '',
        model = '',
        engine = '',
        chassis = '',
        manufacturingYear = '',
        state = '',
        customerId = '',
        customer = null,
        createdAt = new Date()
    } = {}) {
        this.licensePlate = licensePlate
        this.brand = brand
        this.model = model
        this.engine = engine
        this.chassis = chassis
        this.manufacturingYear = manufacturingYear
        this.state = state
        this.customerId = customerId
        this.customer = customer
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            licensePlate: this.licensePlate,
            brand: this.brand,
            model: this.model,
            engine: this.engine,
            chassis: this.chassis,
            manufacturingYear: this.manufacturingYear,
            state: this.state,
            customerId: this.customerId,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Car(data)
    }
}
