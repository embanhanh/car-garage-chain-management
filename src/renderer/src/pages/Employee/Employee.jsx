import './Employee.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical,
    faCaretDown,
    faCheck,
    faArrowUp,
    faArrowDown
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

    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('desc'); // Mặc định desc
    const [filters, setFilters] = useState({
        gender: 'all',
        position: 'all'
    });
    const [originalEmployees, setOriginalEmployees] = useState([]);

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
        const data = await dbService.getAll('employees')
        const users = await dbService.getAll('users')
        const newdata = data.map((nv) => ({
            ...nv,
            hasAccount: users.some((user) => user.employeeId === nv.id)
        }))
        setListEmployees(newdata)
        setOriginalEmployees(newdata)
        console.log('check data employees:', newdata)
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'employees'), async (snapshot) => {
            await fetchData()
        })
        return () => unsubscribe()
    }, [])

    const handleSort = (field) => {
        let newDirection;

        // Nếu click vào field đang được sắp xếp
        if (field === sortField) {
            if (sortDirection === 'desc') {
                // Click lần 2: chuyển sang sort asc
                newDirection = 'asc';
            } else {
                // Click lần 3: bỏ sort và trở về dữ liệu gốc
                setSortField(null);
                setSortDirection('desc'); // Reset về desc cho lần sort tiếp theo
                setListEmployees([...originalEmployees]);
                return;
            }
        } else {
            // Click field mới: sort desc trước
            newDirection = 'desc';
        }

        // Cập nhật state sort trước
        setSortField(field);
        setSortDirection(newDirection);

        const sorted = [...listEmployees].sort((a, b) => {
            if (!a[field] || !b[field]) return 0;

            if (field === 'id') {
                const numA = parseInt(a[field].substring(2)) || 0;
                const numB = parseInt(b[field].substring(2)) || 0;
                return newDirection === 'desc' ? numB - numA : numA - numB;
            }

            if (field === 'salary') {
                const salaryA = parseFloat(a[field].replace(/[^0-9.-]+/g, '')) || 0;
                const salaryB = parseFloat(b[field].replace(/[^0-9.-]+/g, '')) || 0;
                return newDirection === 'desc' ? salaryB - salaryA : salaryA - salaryB;
            }

            const valueA = String(a[field] || '').toLowerCase();
            const valueB = String(b[field] || '').toLowerCase();
            return newDirection === 'desc' 
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB);
        });

        setListEmployees(sorted);
    };

    const handleFilter = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));

        if (value === 'all') {
            setListEmployees([...originalEmployees]);
            return;
        }

        const filtered = originalEmployees.filter((employee) => {
            switch (type) {
                case 'gender':
                    return employee.gender === value;
                case 'position':
                    return employee.position === value;
                default:
                    return true;
            }
        });

        setListEmployees(filtered);
    };

    return (
        <div className="main-container">
            <div className="headerr">
                <div className="btn-area">
                    <button className="primary-button" onClick={addEmployee}>
                        Thêm Nhân Viên
                    </button>
                </div>

                <div className="filter-area">
                    <div className="dropdown">
                        <button className={`page__header-button ${sortField ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faArrowUpWideShort} className="page__header-icon" />
                            Sắp xếp{' '}
                            {sortField && 
                                `(${sortField === 'id' ? 'Mã NV' : 'Lương'} ${sortDirection === 'asc' ? '↑' : '↓'})`}
                            <FontAwesomeIcon 
                                icon={faCaretDown} 
                                className={`page__header-icon ${sortField ? 'active' : ''}`} 
                            />
                        </button>
                        <div className="dropdown-content">
                            <div>
                                <h4>Sắp xếp theo</h4>
                                <button onClick={() => handleSort('id')}>
                                    Mã nhân viên
                                    {sortField === 'id' && (
                                        <>
                                            <FontAwesomeIcon 
                                                icon={sortDirection === 'asc' ? faArrowUp : faArrowDown} 
                                                className="sort-direction-icon" 
                                            />
                                            <span className="selected-text">
                                                {sortDirection === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                                            </span>
                                        </>
                                    )}
                                </button>
                                <button onClick={() => handleSort('salary')}>
                                    Lương
                                    {sortField === 'salary' && (
                                        <>
                                            <FontAwesomeIcon 
                                                icon={sortDirection === 'asc' ? faArrowUp : faArrowDown} 
                                                className="sort-direction-icon" 
                                            />
                                            <span className="selected-text">
                                                {sortDirection === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown">
                        <button className={`page__header-button ${(filters.gender !== 'all' || filters.position !== 'all') ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
                            Lọc{' '}
                            {filters.gender !== 'all' && `(${filters.gender})`}
                            {filters.position !== 'all' && 
                                `${filters.gender !== 'all' ? ', ' : '('}${filters.position}${filters.gender === 'all' ? ')' : ')'}`}
                            <FontAwesomeIcon 
                                icon={faCaretDown} 
                                className={`page__header-icon ${(filters.gender !== 'all' || filters.position !== 'all') ? 'active' : ''}`} 
                            />
                        </button>
                        <div className="dropdown-content">
                            <div>
                                <h4>Giới tính</h4>
                                <button onClick={() => handleFilter('gender', 'all')}>
                                    Tất cả
                                    {filters.gender === 'all' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                                <button onClick={() => handleFilter('gender', 'Nam')}>
                                    Nam
                                    {filters.gender === 'Nam' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                                <button onClick={() => handleFilter('gender', 'Nữ')}>
                                    Nữ
                                    {filters.gender === 'Nữ' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                            </div>
                            <div>
                                <h4>Vị trí</h4>
                                <button onClick={() => handleFilter('position', 'all')}>
                                    Tất cả
                                    {filters.position === 'all' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                                <button onClick={() => handleFilter('position', 'Quản lý')}>
                                    Quản lý
                                    {filters.position === 'Quản lý' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                                <button onClick={() => handleFilter('position', 'Nhân viên')}>
                                    Nhân viên
                                    {filters.position === 'Nhân viên' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                                <button onClick={() => handleFilter('position', 'Kỹ thuật viên')}>
                                    Kỹ thuật viên
                                    {filters.position === 'Kỹ thuật viên' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
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
