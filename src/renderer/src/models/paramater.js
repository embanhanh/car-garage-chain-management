export class Parameter {
    constructor({ id = '', name = '', value = '' }) {
        this.id = id
        this.name = name
        this.value = value
    }

    toFirestore() {
        return {
            id: this.id,
            name: this.name,
            value: this.value
        }
    }

    static fromFirestore(data) {
        return new Parameter(data)
    }
}
