import './Employee.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination'
import { useState, useEffect, useMemo, useCallback } from 'react'
import ZTable from '../../components/ztable/ztable'
import Modal from '../../components/Modal'
import AddEmployee from './add_employee'
import { dbService } from '../../services/DatabaseService.js'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import { db } from '../../firebase.config'

function Employee() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9
    const columns = [
        { name: 'Mã NV', field: 'id', width: '8%' },
        { name: 'Họ tên', field: 'name', width: '20%' },
        { name: 'Email', field: 'email', width: '25%' },
        { name: 'CCCD', field: 'identifyCard', width: '15%' },
        { name: 'Giới tính', field: 'gender', width: '10%' },
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

    const [isOpenAddDialog, setIsOpenAddDialog] = useState(false)
    const [listEmployees, setListEmployees] = useState([])

    const totalPages = Math.ceil(listEmployees.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return listEmployees.slice(start, start + itemsPerPage)
    }, [currentPage, listEmployees])

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    const addEmployee = () => {
        setIsOpenAddDialog(true)
    }
    const fetchData = async () => {
        const data = await dbService.getAll('employees')
        const users = await dbService.getAll('users')
        const newdata = data.map((nv) => ({
            ...nv,
            hasAccount: users.some((user) => user.employeeId === nv.id)
        }))
        setListEmployees(newdata)
        console.log('check data employees:', newdata)
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'employees'), async (snapshot) => {
            await fetchData()
        })
        return () => unsubscribe()
    }, [])

    return (
        <div className="main-container">
            <div className="headerr">
                <div className="btn-area">
                    <button className="addBtn" onClick={addEmployee}>
                        Thêm Nhân Viên
                    </button>
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
            <Modal
                isOpen={isOpenAddDialog}
                onClose={() => setIsOpenAddDialog(false)}
                showHeader={false}
                width="680px"
            >
                <AddEmployee onClose={() => setIsOpenAddDialog(false)}></AddEmployee>
            </Modal>
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
