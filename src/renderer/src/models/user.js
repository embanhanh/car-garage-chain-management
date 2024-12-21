export class User {
    static relations = [
        {
            collection: 'employees',
            foreignKey: 'employeeId',
            as: 'employee'
        }
    ]
    constructor({
        id = '',
        userName = '',
        password = '',
        role = '',
        employeeId = '',
        employee = null,
        createdAt = new Date()
    } = {}) {
        this.id = id
        this.userName = userName
        this.password = password
        this.role = role
        this.employeeId = employeeId
        this.employee = employee
        this.createdAt = createdAt
    }

    toFirestore() {
        return {
            userName: this.userName,
            password: this.password,
            role: this.role,
            employeeId: this.employeeId,
            createdAt: this.createdAt
        }
    }

    static fromFirestore(data) {
        return new User(data)
    }
}
