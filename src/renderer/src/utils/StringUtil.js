import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    format
} from 'date-fns'

export const convertMoney = (number) => {
    if (number) {
        return number.toLocaleString('vi-VN') + 'đ'
    } else {
        return
    }
}

export const removeDiacritics = (str) => {
    str = str.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    // Loại bỏ các ký tự đặc biệt
    str = str.replace(/[^a-z0-9]/g, ' ')
    // Loại bỏ khoảng trắng thừa
    str = str.replace(/\s+/g, ' ')
    return str.trim()
}

export function removeVietnameseTones(str) {
    return str
        .normalize('NFD') // Chuyển chuỗi về dạng Normal Form Decomposition
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu
        .replace(/đ/g, 'd') // Chuyển 'đ' thành 'd'
        .replace(/Đ/g, 'D') // Chuyển 'Đ' thành 'D'
        .replace(/[^a-zA-Z0-9\s]/g, '') // Loại bỏ các ký tự đặc biệt nếu cần
}

export function validateResult(result) {
    if (isNaN(result) || !isFinite(result)) {
        return 0
    }
    return result
}

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const getDateRangeText = (dateRange, selectedDate) => {
    const now = selectedDate || new Date()
    switch (dateRange) {
        case 'week':
            const weekStart = startOfWeek(now, { weekStartsOn: 1 })
            const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
            return `từ ${format(weekStart, 'dd/MM/yyyy')} đến ${format(weekEnd, 'dd/MM/yyyy')}`
        case 'month':
            const monthStart = startOfMonth(now)
            const monthEnd = endOfMonth(now)
            return `từ ${format(monthStart, 'dd/MM/yyyy')} đến ${format(monthEnd, 'dd/MM/yyyy')}`
        case 'year':
            const yearStart = startOfYear(now)
            const yearEnd = endOfYear(now)
            return `từ ${format(yearStart, 'dd/MM/yyyy')} đến ${format(yearEnd, 'dd/MM/yyyy')}`
        default:
            return ''
    }
}
