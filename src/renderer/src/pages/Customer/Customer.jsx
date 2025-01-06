import './Customer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical,
    faCaretDown,
    faArrowUp,
    faArrowDown
} from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination'
import { useState, useMemo, useCallback, useEffect } from 'react'
import ZTable from '../../components/ztable/ztable'
import Modal from '../../components/Modal'
import AddCustomer from './add_customer'
import { dbService } from '../../services/DatabaseService.js'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import { db } from '../../firebase.config'
import DetailCustomer from './detail_customer.jsx'
import DialogConfirmDialog from '../../components/dialog_confirm_dialog.jsx'

function Customer() {
    const [isOpenAdd, setIsOpenAdd] = useState(false)
    const [isOpenEdit, setIsOpenEdit] = useState(false)
    const [isOpenDetail, setIsOpenDetail] = useState(false)
    const [isOpenDelete, setIsOpenDelete] = useState(false)

    const [customer, selecteCustomer] = useState({})
    const [originalCustomers, setOriginalCustomers] = useState([])
    const [listCustomers, setListCustomers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const [sortField, setSortField] = useState(null)
    const [sortDirection, setSortDirection] = useState('desc')

    const [filters, setFilters] = useState({
        gender: 'all',
        ageRange: 'all',
        status: 'all'
    })

    const [searchTerm, setSearchTerm] = useState('')

    const columns = [
        { name: 'Mã KH', field: 'id', width: '8%' },
        { name: 'Họ tên', field: 'name', width: '20%' },
        { name: 'CCCD', field: 'identifyCard', width: '15%' },
        { name: 'Email', field: 'email', width: '25%' },
        { name: 'SDT', field: 'phone', width: '10%' },
        { name: 'Ngày sinh', field: 'birthday', width: '10%' },
        { name: '', field: 'actions', width: '5%' }
    ]

    // Kiểm tra columns đã định nghĩa
    console.log('Columns:', columns);

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

    const searchCustomers = useMemo(() => {
        if (!searchTerm) return listCustomers

        const searchLower = searchTerm.toLowerCase().trim()

        return listCustomers.filter((customer) => {
            // Kiểm tra mã khách hàng (format KHxxxx)
            if (searchLower.startsWith('kh')) {
                return customer.id.toLowerCase().includes(searchLower)
            }

            // Kiểm tra số điện thoại
            if (
                /^(\+84|0)\d{9,10}$/.test(searchLower.replace(/\s/g, '')) ||
                (/^\d+$/.test(searchLower) && searchLower.length >= 9 && searchLower.length <= 10)
            ) {
                const phoneSearch = searchLower.replace(/\s/g, '').replace(/^\+84/, '0')
                const customerPhone = customer.phone?.replace(/\s/g, '').replace(/^\+84/, '0') || ''
                return customerPhone.includes(phoneSearch)
            }

            // Kiểm tra CCCD
            if (/^\d+$/.test(searchLower) && searchLower.length >= 9) {
                return customer.identifyCard.includes(searchLower)
            }

            // Kiểm tra email
            if (searchLower.includes('@')) {
                return customer.email.toLowerCase().includes(searchLower)
            }

            // Mặc định tìm theo tất cả
            return (
                customer.name.toLowerCase().includes(searchLower) ||
                customer.id.toLowerCase().includes(searchLower) ||
                customer.email.toLowerCase().includes(searchLower) ||
                customer.identifyCard.includes(searchLower) ||
                (customer.phone || '').replace(/\s/g, '').includes(searchLower.replace(/\s/g, ''))
            )
        })
    }, [listCustomers, searchTerm])

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return searchCustomers.slice(start, start + itemsPerPage)
    }, [currentPage, searchCustomers])

    const totalPages = Math.ceil(searchCustomers.length / itemsPerPage)

    const fetchData = async () => {
        const data = await dbService.getAll('customers')
        setOriginalCustomers(data)
        setListCustomers(data)
        console.log('check data customers:', data)
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

    const handleEdit = (kh) => {
        selecteCustomer(kh)
        setIsOpenEdit(true)
    }
    const handleDetail = (kh) => {
        selecteCustomer(kh)
        setIsOpenDetail(true)
    }
    const handleDelete = (kh) => {
        selecteCustomer(kh)
        setIsOpenDelete(true)
    }

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
                setListCustomers([...originalCustomers]);
                return;
            }
        } else {
            // Click field mới: sort desc trước
            newDirection = 'desc';
        }

        // Cập nhật state sort trước
        setSortField(field);
        setSortDirection(newDirection);

        const sorted = [...listCustomers].sort((a, b) => {
            if (!a[field] || !b[field]) return 0;

            if (field === 'id') {
                const numA = parseInt(a[field].substring(2)) || 0;
                const numB = parseInt(b[field].substring(2)) || 0;
                return newDirection === 'desc' ? numB - numA : numA - numB;
            }

            if (field === 'birthday') {
                const dateA = new Date(a[field] || '');
                const dateB = new Date(b[field] || '');
                return newDirection === 'desc' ? dateB - dateA : dateA - dateB;
            }

            const valueA = String(a[field] || '').toLowerCase();
            const valueB = String(b[field] || '').toLowerCase();
            return newDirection === 'desc' 
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB);
        });

        setListCustomers(sorted);
    };

    const handleFilter = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));

        if (value === 'all') {
            setListCustomers([...originalCustomers]);
            return;
        }

        const filtered = originalCustomers.filter((customer) => {
            const age = new Date().getFullYear() - new Date(customer.birthday).getFullYear();
            
            switch (value) {
                case 'under18':
                    return age < 18;
                case '18to30':
                    return age >= 18 && age <= 30;
                case 'over30':
                    return age > 30;
                default:
                    return true;
            }
        });

        setListCustomers(filtered);
    };

    const handleSearch = (event) => {
        const value = event.target.value
        setSearchTerm(value)

        if (value.trim() === '') {
            setListCustomers(originalCustomers)
            return
        }

        // Tìm kiếm từ danh sách gốc thay vì danh sách đã lọc
        const searchResults = originalCustomers.filter((customer) => {
            if (!customer.name) return false

            // Chuyển cả tên khách hàng và từ khóa tìm kiếm về chữ thường và bỏ dấu
            const normalizedName = customer.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            const normalizedSearch = value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')

            return normalizedName.includes(normalizedSearch)
        })

        setListCustomers(searchResults)
    }

    // Thêm useMemo cho sort
    const sortedCustomers = useMemo(() => {
        if (!sortField) return listCustomers;

        return [...listCustomers].sort((a, b) => {
            if (!a[sortField] || !b[sortField]) return 0;

            if (sortField === 'id') {
                const numA = parseInt(a[sortField].substring(2)) || 0;
                const numB = parseInt(b[sortField].substring(2)) || 0;
                return sortDirection === 'desc' ? numB - numA : numA - numB;
            }

            if (sortField === 'birthday') {
                const dateA = new Date(a[sortField] || '');
                const dateB = new Date(b[sortField] || '');
                return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
            }

            const valueA = String(a[sortField] || '').toLowerCase();
            const valueB = String(b[sortField] || '').toLowerCase();
            return sortDirection === 'desc' 
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB);
        });
    }, [listCustomers, sortField, sortDirection]);

    // Thêm useMemo cho filter
    const filteredCustomers = useMemo(() => {
        if (filters.ageRange === 'all') return originalCustomers;

        return originalCustomers.filter((customer) => {
            const age = new Date().getFullYear() - new Date(customer.birthday).getFullYear();
            
            switch (filters.ageRange) {
                case 'under18':
                    return age < 18;
                case '18to30':
                    return age >= 18 && age <= 30;
                case 'over30':
                    return age > 30;
                default:
                    return true;
            }
        });
    }, [originalCustomers, filters.ageRange]);

    return (
        <div className="main-container">
            <div className="headerr">
                <div className="btn-area"></div>

                <div className="filter-area">
                    <div className="dropdown">
                        <button className={`page__header-button ${sortField ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faArrowUpWideShort} className="page__header-icon" />
                            Sắp xếp{' '}
                            {sortField && 
                                `(${sortField === 'id' ? 'Mã KH' : 'Ngày sinh'} ${sortDirection === 'asc' ? '↑' : '↓'})`}
                            <FontAwesomeIcon 
                                icon={faCaretDown} 
                                className={`page__header-icon ${sortField ? 'active' : ''}`} 
                            />
                        </button>
                        <div className="dropdown-content">
                            <div>
                                <h4>Sắp xếp theo</h4>
                                <button onClick={() => handleSort('id')}>
                                    Mã khách hàng
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
                                <button onClick={() => handleSort('birthday')}>
                                    Ngày sinh
                                    {sortField === 'birthday' && (
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
                        <button className={`page__header-button ${filters.ageRange !== 'all' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
                            Lọc{' '}
                            {filters.ageRange !== 'all' && 
                                `(${filters.ageRange === 'under18' ? 'Dưới 18' : 
                                    filters.ageRange === '18to30' ? '18-30' : 
                                    'Trên 30'})`}
                            <FontAwesomeIcon 
                                icon={faCaretDown} 
                                className={`page__header-icon ${filters.ageRange !== 'all' ? 'active' : ''}`} 
                            />
                        </button>
                        <div className="dropdown-content">
                            <div>
                                <h4>Độ tuổi</h4>
                                <button onClick={() => handleFilter('ageRange', 'all')}>
                                    Tất cả
                                    {filters.ageRange === 'all' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                                <button onClick={() => handleFilter('ageRange', 'under18')}>
                                    Dưới 18 tuổi
                                    {filters.ageRange === 'under18' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                                <button onClick={() => handleFilter('ageRange', '18to30')}>
                                    18-30 tuổi
                                    {filters.ageRange === '18to30' && (
                                        <FontAwesomeIcon 
                                            icon={faFilter}
                                            className="filter-icon" 
                                        />
                                    )}
                                </button>
                                <button onClick={() => handleFilter('ageRange', 'over30')}>
                                    Trên 30 tuổi
                                    {filters.ageRange === 'over30' && (
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
                            placeholder="Tìm kiếm theo mã KH, tên, email, SĐT, CCCD..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="employee-table">
                <div className="z-car-page">
                    <div className="z-car-page__header">{/* Header content here */}</div>
                    <div className="z-car-page__content">
                        <ZTable
                            detailAction={handleDetail}
                            editAction={handleEdit}
                            deleteAction={handleDelete}
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
            <Modal
                isOpen={isOpenEdit}
                onClose={() => setIsOpenEdit(false)}
                showHeader={false}
                width="680px"
            >
                <AddCustomer
                    onClose={() => setIsOpenEdit(false)}
                    kh={customer}
                    isEdit={true}
                ></AddCustomer>
            </Modal>
            <Modal
                isOpen={isOpenDetail}
                onClose={() => setIsOpenDetail(false)}
                showHeader={false}
                width="680px"
            >
                <DetailCustomer
                    onClose={() => setIsOpenDetail(false)}
                    nv={customer}
                ></DetailCustomer>
            </Modal>
            <DialogConfirmDialog
                isShow={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                message="Bạn có chắn chắn muốn xoá khách hàng này"
                onConfirm={async () => {
                    await dbService.softDelete('customers', customer.id)
                    setIsOpenDelete(false)
                }}
            ></DialogConfirmDialog>
        </div>
    )
}

export default Customer
