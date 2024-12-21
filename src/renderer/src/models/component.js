export class Component {
    static relations = [
        {
            collection: 'categories',
            foreignKey: 'categoryId',
            as: 'category'
        },
        {
            collection: 'suppliers',
            foreignKey: 'supplierIds',
            as: 'suppliers',
            isArray: true
        }
    ]
    constructor({
        id = '',
        name = '',
        price = 0,
        categoryId = '',
        category = null,
        supplierIds = [],
        suppliers = [],
        description = '',
        size = '',
        weight = '',
        material = '',
        inventory = 0,
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.name = name
        this.price = price
        this.categoryId = categoryId
        this.category = category
        this.supplierIds = supplierIds
        this.suppliers = suppliers
        this.description = description
        this.size = size
        this.weight = weight
        this.material = material
        this.inventory = inventory
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            categoryId: this.categoryId,
            supplierIds: this.supplierIds,
            description: this.description,
            size: this.size,
            weight: this.weight,
            material: this.material,
            inventory: this.inventory,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new Component(data)
    }
}
