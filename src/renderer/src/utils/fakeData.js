import {
    addDays,
    format,
    startOfWeek,
    startOfMonth,
    startOfYear,
    endOfWeek,
    endOfMonth,
    endOfYear
} from 'date-fns'

export const generateFakeData = (dateRange, selectedDate) => {
    const getDateRange = () => {
        const now = selectedDate || new Date()

        switch (dateRange) {
            case 'week':
                return {
                    start: startOfWeek(now, { weekStartsOn: 1 }), // Bắt đầu từ thứ 2
                    end: endOfWeek(now, { weekStartsOn: 1 })
                }
            case 'month':
                return {
                    start: startOfMonth(now),
                    end: endOfMonth(now)
                }
            case 'year':
                return {
                    start: startOfYear(now),
                    end: endOfYear(now)
                }
            default:
                return {
                    start: startOfWeek(now, { weekStartsOn: 1 }),
                    end: endOfWeek(now, { weekStartsOn: 1 })
                }
        }
    }

    const generateRevenueData = () => {
        const { start, end } = getDateRange()
        const data = {
            labels: [],
            revenue: [],
            cost: []
        }

        if (dateRange === 'year') {
            // Dữ liệu theo tháng
            for (let month = 0; month < 12; month++) {
                data.labels.push(['Tháng', month + 1].join(' '))
                data.revenue.push(Math.floor(Math.random() * 500000000) + 200000000) // 200tr - 700tr
                data.cost.push(Math.floor(Math.random() * 300000000) + 100000000) // 100tr - 400tr
            }
        } else {
            // Dữ liệu theo ngày
            let currentDate = start
            while (currentDate <= end) {
                data.labels.push(format(currentDate, 'dd/MM'))
                data.revenue.push(Math.floor(Math.random() * 20000000) + 10000000) // 10tr - 30tr
                data.cost.push(Math.floor(Math.random() * 15000000) + 5000000) // 5tr - 20tr
                currentDate = addDays(currentDate, 1)
            }
        }

        return data
    }

    const generateStockData = () => {
        const parts = [
            {
                id: 1,
                name: 'Lốp xe',
                category: 'Phụ tùng ngoài',
                baseStock: 50,
                baseUsed: 150,
                importPrice: 500000,
                sellPrice: 750000
            },
            {
                id: 2,
                name: 'Dầu động cơ',
                category: 'Phụ tùng trong',
                baseStock: 100,
                baseUsed: 300,
                importPrice: 200000,
                sellPrice: 300000
            },
            {
                id: 3,
                name: 'Phanh đĩa',
                category: 'Phụ tùng trong',
                baseStock: 30,
                baseUsed: 80,
                importPrice: 800000,
                sellPrice: 1200000
            },
            {
                id: 4,
                name: 'Ắc quy',
                category: 'Phụ tùng ngoài',
                baseStock: 25,
                baseUsed: 60,
                importPrice: 1200000,
                sellPrice: 1600000
            },
            {
                id: 5,
                name: 'Bugi',
                category: 'Phụ tùng trong',
                baseStock: 200,
                baseUsed: 450,
                importPrice: 100000,
                sellPrice: 150000
            }
        ]

        // Thêm biến động theo thời gian
        const fluctuation = () => Math.random() * 0.4 + 0.8 // 0.8 - 1.2

        return parts.map((part) => ({
            ...part,
            stock: Math.floor(part.baseStock * fluctuation()),
            used: Math.floor(part.baseUsed * fluctuation())
        }))
    }

    const generateServiceData = () => {
        const services = [
            'Thay dầu máy',
            'Thay lốp',
            'Bảo dưỡng định kỳ',
            'Sửa phanh',
            'Thay ắc quy',
            'Cân chỉnh động cơ'
        ]

        const { start, end } = getDateRange()
        const data = {
            labels: [],
            counts: []
        }

        if (dateRange === 'year') {
            // Dữ liệu theo tháng
            for (let month = 0; month < 12; month++) {
                const monthData = {}
                services.forEach((service) => {
                    monthData[service] = Math.floor(Math.random() * 30) + 10 // 10-40 dịch vụ/tháng
                })
                data.labels.push(['Tháng', month + 1].join(' '))
                data.counts.push(monthData)
            }
        } else {
            // Dữ liệu theo ngày
            let currentDate = start
            while (currentDate <= end) {
                const dayData = {}
                services.forEach((service) => {
                    dayData[service] = Math.floor(Math.random() * 5) + 1 // 1-6 dịch vụ/ngày
                })
                data.labels.push(format(currentDate, 'dd/MM'))
                data.counts.push(dayData)
                currentDate = addDays(currentDate, 1)
            }
        }

        return {
            services,
            ...data
        }
    }

    return {
        revenue: generateRevenueData(),
        stock: generateStockData(),
        service: generateServiceData()
    }
}
