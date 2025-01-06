export class Component {
    static relations = [
        {
            collection: 'categories',
            foreignKey: 'categoryId',
            as: 'category'
        }
    ]

    constructor({
        id = '',
        name = '',
        price = 0,
        categoryId = '',
        category = null,
        description = '',
        size = '',
        weight = '',
        material = '',
        inventory = 0,
        storagePosition = '',
        garageId = '',
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.name = name
        this.price = price
        this.categoryId = categoryId
        this.category = category
        this.description = description
        this.size = size
        this.weight = weight
        this.material = material
        this.inventory = inventory
        this.storagePosition = storagePosition
        this.garageId = garageId
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            categoryId: this.categoryId,
            description: this.description,
            size: this.size,
            weight: this.weight,
            material: this.material,
            inventory: this.inventory,
            storagePosition: this.storagePosition,
            createdAt: this.createdAt,
            garageId: this.garageId
        }
    }

    static fromFirestore(data) {
        return new Component(data)
    }
}
