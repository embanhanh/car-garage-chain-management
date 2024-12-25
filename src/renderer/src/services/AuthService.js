import bcrypt from 'bcryptjs'
import { dbService } from './DatabaseService'

class AuthService {
    static instance = null

    constructor() {
        if (AuthService.instance) {
            return AuthService.instance
        }
        AuthService.instance = this
        this.saltRounds = 10
    }

    /**
     * Hash mật khẩu
     * @param {string} password - Mật khẩu cần hash
     * @returns {Promise<string>} Mật khẩu đã được hash
     */
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(this.saltRounds)
            return await bcrypt.hash(password, salt)
        } catch (error) {
            console.error('Lỗi khi hash mật khẩu:', error)
            throw error
        }
    }

    /**
     * So sánh mật khẩu
     * @param {string} password - Mật khẩu người dùng nhập
     * @param {string} hashedPassword - Mật khẩu đã hash trong database
     * @returns {Promise<boolean>} Kết quả so sánh
     */
    async comparePassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword)
        } catch (error) {
            console.error('Lỗi khi so sánh mật khẩu:', error)
            throw error
        }
    }

    /**
     * Đăng nhập
     * @param {string} username
     * @param {string} password
     * @returns {Promise<Object|null>} Thông tin user nếu đăng nhập thành công
     */
    async login(username, password) {
        try {
            // Tìm user theo username
            const users = await dbService.findBy('users', [
                { field: 'userName', operator: '==', value: username }
            ])

            if (!users || users.length === 0) {
                return null
            }

            const user = users[0]

            // So sánh mật khẩu
            const isMatch = await this.comparePassword(password, user.password)
            if (!isMatch) {
                return null
            }

            // Cập nhật thời gian đăng nhập cuối
            // await dbService.update('users', user.id, {
            //     ...user,
            //     lastLogin: new Date()
            // })

            // Xóa password trước khi trả về
            const { password: _, ...userWithoutPassword } = user
            return userWithoutPassword
        } catch (error) {
            console.error('Lỗi đăng nhập:', error)
            throw error
        }
    }

    /**
     * Tạo tài khoản mới
     * @param {Object} userData - Thông tin user
     * @returns {Promise<Object>} Thông tin user đã tạo
     */
    async createUser(userData) {
        try {
            // Kiểm tra username đã tồn tại
            const existingUsers = await dbService.findBy('users', [
                { field: 'userName', operator: '==', value: userData.userName }
            ])

            if (existingUsers && existingUsers.length > 0) {
                throw new Error('Tên đăng nhập đã tồn tại')
            }

            // Hash mật khẩu
            const hashedPassword = await this.hashPassword(userData.password)

            // Tạo user mới với mật khẩu đã hash
            const newUser = await dbService.add('users', {
                ...userData,
                password: hashedPassword,
                createdAt: new Date()
                // updatedAt: new Date()
            })

            // Xóa password trước khi trả về
            const { password: _, ...userWithoutPassword } = newUser
            return userWithoutPassword
        } catch (error) {
            console.error('Lỗi khi tạo tài khoản:', error)
            throw error
        }
    }

    /**
     * Đổi mật khẩu
     * @param {string} userId
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise<boolean>}
     */
    async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await dbService.getById('users', userId)
            if (!user) {
                throw new Error('Không tìm thấy user')
            }

            // Kiểm tra mật khẩu cũ
            const isMatch = await this.comparePassword(oldPassword, user.password)
            if (!isMatch) {
                throw new Error('Mật khẩu cũ không đúng')
            }

            // Hash mật khẩu mới
            const hashedPassword = await this.hashPassword(newPassword)

            // Cập nhật mật khẩu
            await dbService.updateFields('users', userId, {
                password: hashedPassword
            })

            return true
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error)
            throw error
        }
    }
}

export const authService = new AuthService()
