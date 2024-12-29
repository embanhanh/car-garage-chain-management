import './Component.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { dbService } from '../../services/DatabaseService.js'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import { db } from '../../firebase.config'
import ZTable from '../../components/ztable/ztable'

function Component() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    const [listComponents, setListComponents] = useState([])

    const columns = [
        { name: 'Thứ tự', field: 'cnt', width: '10%' },
        { name: 'Mã phụ tùng', field: 'id', width: '20%' },
        { name: 'Tên phụ tùng', field: 'name', width: '30%' },
        { name: 'Loại phụ tùng', field: 'category', width: '20%' },
        { name: 'Số lượng', field: 'inventory', width: '15%' },
        { name: 'Đơn giá', field: 'price', width: '15%' },
        { name: 'Kho hàng', field: 'storage', width: '15%' },
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

    const totalPages = Math.ceil(listComponents.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return listComponents.slice(start, start + itemsPerPage)
    }, [currentPage, listComponents])

    const fetchData = async () => {
        const data = await dbService.getAll('components')
        const cate = await dbService.getAll('categories')
        var cnt = 0
        const newList = data.map((item) => {
            const category = cate.find((c) => c.id === item.categoryId) // Tìm category tương ứng
            return {
                cnt: ++cnt,
                ...item, // Giữ nguyên các trường của item
                category: category ? category.name : 'Khác' // Thêm trường category hoặc null nếu không tìm thấy
            }
        })

        setListComponents(newList)
        console.log('check data components:', data)
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'customers'), async (snapshot) => {
            await fetchData()
        })
        return () => unsubscribe()
    }, [])

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
                    <button className="addBtn">Kho Phụ Tùng</button>
                    <button className="addAccBtn">Phiếu Nhập Kho</button>
                </div>
                <div className="z-btn-center-buy">
                    <button className="addBtn">Mua Hàng</button>
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

export default Component
