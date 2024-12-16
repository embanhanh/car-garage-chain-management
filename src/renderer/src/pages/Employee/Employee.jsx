import './Employee.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination'
import { useState, useMemo, useCallback } from 'react'
import ZTable from '../../components/ztable/ztable'
function Employee() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    function generateRandomIDNumber() {
        const regionCode = Math.floor(10 + Math.random() * 90) // Random 2-digit region code (10 to 99)
        const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000) // Random 10-digit number
        return `${regionCode}${randomDigits}`
    }
    function generateRandomIDNumber() {
        const regionCode = Math.floor(10 + Math.random() * 90) // Random 2-digit region code (10 to 99)
        const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000) // Random 10-digit number
        return `${regionCode}${randomDigits}`
    }

    const mockData = [...Array(20)].map((_, index) => ({
        id: 'NV' + (index + 1).toString(),
        name: `Phạm Ngọc ${String(12345 + index).padStart(5, '0')}`,
        email: `phamngoc${String(12345 + index).padStart(5, '0')}@gmail.com`,
        passport: generateRandomIDNumber(),
        sex: Math.random() % 2 ? 'Nam' : 'Nữ',
        position:
            Math.random() % 3 == 0 ? (Math.random() % 2 ? 'Quản lý' : 'Thu ngân') : 'Kỹ thuật',
        salary: generateRandomIDNumber()
    }))
    const columns = [
        { name: 'Mã NV', field: 'id', width: '8%' },
        { name: 'Họ tên', field: 'name', width: '20%' },
        { name: 'Email', field: 'email', width: '25%' },
        { name: 'CCCD', field: 'passport', width: '15%' },
        { name: 'Giới tính', field: 'sex', width: '10%' },
        { name: 'Vị trí', field: 'position', width: '10%' },
        { name: 'Lương', field: 'salary', width: '15%' },
        { name: '', field: 'actions', width: '5%' }
    ]

    // const data = [
    //   {
    //     id: '001',
    //     name: 'Nguyen Van A',
    //     email: 'a@example.com',
    //     passport: '123456789',
    //     sex: 'Nam',
    //     position: 'Nhân viên',
    //     salary: '10,000,000 VND',
    //   },
    //   // ... more data items
    // ];

    const totalPages = Math.ceil(mockData.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return mockData.slice(start, start + itemsPerPage)
    }, [currentPage, mockData])

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )
    return (
        <div className="main-container">
            <div className="headerr">
                <div className="btn-area">
                    <button className="addBtn">Thêm Nhân Viên</button>
                    <button className="addAccBtn">Cấp Tài Khoản</button>
                </div>

                <div className="filter-area">
                    <button className="page__header-button">
                        <FontAwesomeIcon icon={faArrowUpWideShort} className="page__header-icon" />
                        Sắp xếp
                    </button>
                    <button className="page__header-button">
                        <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
                        Lọc
                    </button>
                    <div className="page__header-search">
                        <FontAwesomeIcon icon={faSearch} className="page__header-icon" />
                        <input type="text" placeholder="Tìm kiếm" />
                    </div>
                </div>
            </div>
            <div className="employee-table">
                <div className="z-car-page">
                    <div className="z-car-page__header">{/* Header content here */}</div>
                    <div className="z-car-page__content">
                        <ZTable columns={columns} data={currentData} />
                    </div>
                </div>
                <div className="z-pagination">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default Employee
