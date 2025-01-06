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
import AddAccount from './add_account.jsx'
import DetailEmployee from './detail_employee.jsx'
import DialogConfirmDialog from '../../components/dialog_confirm_dialog.jsx'

function Employee() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9
    const columns = [
        { name: 'Mã NV', field: 'id', width: '10%' },
        { name: 'Họ tên', field: 'name', width: '18%' },
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
    const [isOpenAddAccount, setIsOpenAddAccount] = useState(false)
    const [isOpenDetailEmployee, setIsOpenDetailEmployee] = useState(false)
    const [isOpenEditEmployee, setIsOpenEditEmployee] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    const [userAdd, setUserAdd] = useState({
        idNV: 'zont09',
        role: 'nhanvien'
    })
    const [listEmployees, setListEmployees] = useState([])

    const [searchTerm, setSearchTerm] = useState('')

    const searchEmployees = useMemo(() => {
        if (!searchTerm) return listEmployees

        const searchLower = searchTerm.toLowerCase().trim()

        return listEmployees.filter((employee) => {
            // Kiểm tra xem searchTerm có phải là mã nhân viên không (format NVxxxx)
            if (searchLower.startsWith('nv')) {
                return employee.id.toLowerCase().includes(searchLower)
            }

            // Kiểm tra CCCD (chuỗi 12 số)
            if (/^\d+$/.test(searchLower) && searchLower.length >= 9) {
                return employee.identifyCard.includes(searchLower)
            }

            // Kiểm tra email
            if (searchLower.includes('@')) {
                return employee.email.toLowerCase().includes(searchLower)
            }

            // Kiểm tra vị trí công việc
            const positions = ['quản lý', 'nhân viên', 'kỹ thuật viên', 'thủ kho']
            if (positions.some((pos) => searchLower.includes(pos.toLowerCase()))) {
                return employee.position.toLowerCase().includes(searchLower)
            }

            // Mặc định tìm theo tên
            return (
                employee.name.toLowerCase().includes(searchLower) ||
                employee.id.toLowerCase().includes(searchLower) ||
                employee.email.toLowerCase().includes(searchLower) ||
                employee.identifyCard.includes(searchLower) ||
                employee.position.toLowerCase().includes(searchLower)
            )
        })
    }, [listEmployees, searchTerm])

    const totalPages = Math.ceil(searchEmployees.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return searchEmployees.slice(start, start + itemsPerPage)
    }, [currentPage, searchEmployees])

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

    const addAccount = (map) => {
        setUserAdd({
            idNV: map.idNV,
            role: map.role
        })
        setIsOpenAddAccount(true)
    }

    const detailEmployee = (nv) => {
        setUserAdd(nv)
        setIsOpenDetailEmployee(true)
    }

    const editEmployee = (nv) => {
        setUserAdd(nv)
        setIsOpenEditEmployee(true)
    }

    const deleteEmployee = (nv) => {
        setUserAdd(nv)
        setIsOpenDelete(true)
    }

    const fetchData = async () => {
        const data = await dbService.getAll(
            'employees',
            JSON.parse(localStorage.getItem('currentGarage'))?.id
        )
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
                    {JSON.parse(localStorage.getItem('currentUser'))?.role == 'admin' ||
                        (JSON.parse(localStorage.getItem('currentUser'))?.role == 'Quản lý' && (
                            <button className="primary-button" onClick={addEmployee}>
                                Thêm Nhân Viên
                            </button>
                        ))}
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
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã NV, tên, email, CCCD, vị trí..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isOpenAddDialog}
                onClose={() => setIsOpenAddDialog(false)}
                showHeader={true}
                title="Thêm nhân viên mới"
                width="680px"
            >
                <AddEmployee onClose={() => setIsOpenAddDialog(false)}></AddEmployee>
            </Modal>
            <Modal
                isOpen={isOpenEditEmployee}
                onClose={() => setIsOpenEditEmployee(false)}
                showHeader={true}
                title="Cập nhật nhân viên"
                width="680px"
            >
                <AddEmployee
                    onClose={() => setIsOpenEditEmployee(false)}
                    isEdit={true}
                    nv={userAdd}
                ></AddEmployee>
            </Modal>
            <Modal
                isOpen={isOpenAddAccount}
                onClose={() => setIsOpenAddAccount(false)}
                showHeader={true}
                width="300px"
                title="Thêm tài khoản nhân viên"
            >
                <AddAccount
                    onClose={() => setIsOpenAddAccount(false)}
                    idNV={userAdd.idNV}
                    role={userAdd.role}
                ></AddAccount>
            </Modal>
            <Modal
                isOpen={isOpenDetailEmployee}
                onClose={() => setIsOpenDetailEmployee(false)}
                showHeader={true}
                width="680px"
                title="Chi tiết nhân viên"
            >
                <DetailEmployee
                    onClose={() => setIsOpenDetailEmployee(false)}
                    nv={userAdd}
                ></DetailEmployee>
            </Modal>
            <DialogConfirmDialog
                isShow={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                message="Bạn có chắn chắn muốn xoá nhân viên này"
                onConfirm={async () => {
                    await dbService.softDelete('employees', userAdd.id)
                    const listUser = await dbService.getAll('users')
                    const user = listUser.find((item) => item.employeeId === userAdd.id)
                    if (user) {
                        await dbService.softDelete('users', user.id)
                    }
                    setIsOpenDelete(false)
                }}
            ></DialogConfirmDialog>
            <div className="employee-table">
                <div className="z-car-page">
                    <div className="z-car-page__header">{/* Header content here */}</div>
                    <div className="z-car-page__content">
                        <ZTable
                            addAccount={addAccount}
                            detailAction={detailEmployee}
                            editAction={editEmployee}
                            deleteAction={deleteEmployee}
                            columns={columns}
                            data={currentData}
                            isAdmin={
                                JSON.parse(localStorage.getItem('currentUser'))?.role == 'admin' ||
                                JSON.parse(localStorage.getItem('currentUser'))?.role == 'Quản lý'
                            }
                        />
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
