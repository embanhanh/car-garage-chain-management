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
        employee = null
    } = {}) {
        this.id = id
        this.userName = userName
        this.password = password
        this.role = role
        this.employeeId = employeeId
        this.employee = employee
    }

    toFirestore() {
        return {
            userName: this.userName,
            password: this.password,
            role: this.role,
            employeeId: this.employeeId
        }
    }

    static fromFirestore(data) {
        return new User(data)
    }
}
