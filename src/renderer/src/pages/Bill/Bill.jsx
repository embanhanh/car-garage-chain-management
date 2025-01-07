import { useState, useMemo, useCallback, useEffect } from 'react'
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
import { onSnapshot, collection } from 'firebase/firestore'
import { dbService } from '../../services/DatabaseService'
import Pagination from '../../components/Pagination'
import Modal from '../../components/Modal'
import DetailInvoiceModal from '../../components/Repair/DetailInvoice'
import { db } from '../../firebase.config'
import './Bill.css'

const Bill = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [billData, setBillData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [openInvoiceModal, setOpenInvoiceModal] = useState({
        show: false,
        data: null
    })
    const itemsPerPage = 8
    const [sortField, setSortField] = useState(null)
    const [sortDirection, setSortDirection] = useState('desc')
    const [filters, setFilters] = useState({
        status: 'all',
        type: 'all'
    })
    const [originalBills, setOriginalBills] = useState([])

    const fetchData = async () => {
        const data = await dbService.getAll(
            'bills',
            JSON.parse(localStorage.getItem('currentGarage'))?.id
        )
        setBillData(data)
        setOriginalBills(data)
    }

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'bills'), async () => {
            try {
                setIsLoading(true)
                await fetchData()
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error)
            } finally {
                setIsLoading(false)
            }
        })
        return () => unsub()
    }, [])

    const searchBills = useMemo(() => {
        if (!searchTerm) return billData

        const searchLower = searchTerm.toLowerCase().trim()
        return billData.filter((bill) => {
            return (
                bill.id.toLowerCase().includes(searchLower) ||
                bill.employee?.name?.toLowerCase().includes(searchLower) ||
                bill.customer?.name?.toLowerCase().includes(searchLower)
            )
        })
    }, [billData, searchTerm])

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return searchBills.slice(start, start + itemsPerPage)
    }, [currentPage, searchBills])

    const totalPages = Math.ceil(searchBills.length / itemsPerPage)

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    const handleSort = (field) => {
        let newDirection
        if (field === sortField) {
            newDirection = sortDirection === 'desc' ? 'asc' : null
        } else {
            newDirection = 'desc'
        }

        setSortField(newDirection ? field : null)
        setSortDirection(newDirection || 'desc')

        if (!newDirection) {
            setBillData([...originalBills])
            return
        }

        const sorted = [...billData].sort((a, b) => {
            if (field === 'total') {
                return newDirection === 'desc' ? b[field] - a[field] : a[field] - b[field]
            }

            if (field === 'createdAt') {
                return newDirection === 'desc'
                    ? new Date(b[field]) - new Date(a[field])
                    : new Date(a[field]) - new Date(b[field])
            }

            const valueA = String(a[field] || '').toLowerCase()
            const valueB = String(b[field] || '').toLowerCase()
            return newDirection === 'desc'
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB)
        })

        setBillData(sorted)
    }

    const handleFilter = (type, value) => {
        setFilters((prev) => ({ ...prev, [type]: value }))

        let filtered = [...originalBills]

        if (filters.status !== 'all' && type !== 'status') {
            filtered = filtered.filter((bill) => bill.status === filters.status)
        }

        if (filters.type !== 'all' && type !== 'type') {
            filtered = filtered.filter((bill) => bill.type === filters.type)
        }

        if (type === 'status' && value !== 'all') {
            filtered = filtered.filter((bill) => bill.status === value)
        }

        if (type === 'type' && value !== 'all') {
            filtered = filtered.filter((bill) => bill.type === value)
        }

        setBillData(filtered)
    }

    useEffect(() => {
        console.log(billData)
    }, [billData])

    return (
        <div className="bill-page">
            <div className="bill-page__header">
                <div className="dropdown">
                    <button className={`page__header-button ${sortField ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faArrowUpWideShort} className="page__header-icon" />
                        Sắp xếp{' '}
                        {sortField &&
                            `(${
                                sortField === 'total'
                                    ? 'Tổng tiền'
                                    : sortField === 'createdAt'
                                      ? 'Ngày tạo'
                                      : 'Mã HĐ'
                            } 
                             ${sortDirection === 'asc' ? '↑' : '↓'})`}
                        <FontAwesomeIcon icon={faCaretDown} className="page__header-icon" />
                    </button>
                    <div className="dropdown-content">
                        <div>
                            <h4 className="filter-title">Sắp xếp theo</h4>
                            <button onClick={() => handleSort('id')}>
                                Mã hóa đơn
                                {sortField === 'id' && (
                                    <FontAwesomeIcon
                                        icon={sortDirection === 'asc' ? faArrowUp : faArrowDown}
                                        className="sort-direction-icon"
                                    />
                                )}
                            </button>
                            <button onClick={() => handleSort('total')}>
                                Tổng tiền
                                {sortField === 'total' && (
                                    <FontAwesomeIcon
                                        icon={sortDirection === 'asc' ? faArrowUp : faArrowDown}
                                        className="sort-direction-icon"
                                    />
                                )}
                            </button>
                            <button onClick={() => handleSort('createdAt')}>
                                Ngày tạo
                                {sortField === 'createdAt' && (
                                    <FontAwesomeIcon
                                        icon={sortDirection === 'asc' ? faArrowUp : faArrowDown}
                                        className="sort-direction-icon"
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dropdown">
                    <button
                        className={`page__header-button ${
                            filters.status !== 'all' || filters.type !== 'all' ? 'active' : ''
                        }`}
                    >
                        <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
                        Lọc{' '}
                        {(filters.status !== 'all' || filters.type !== 'all') &&
                            `(${[
                                filters.status !== 'all' ? filters.status : '',
                                filters.type !== 'all' ? filters.type : ''
                            ]
                                .filter(Boolean)
                                .join(', ')})`}
                        <FontAwesomeIcon icon={faCaretDown} className="page__header-icon" />
                    </button>
                    <div className="dropdown-content">
                        <div className="filter-section">
                            <h4 className="filter-title">Trạng thái</h4>
                            <button onClick={() => handleFilter('status', 'all')}>
                                Tất cả
                                {filters.status === 'all' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                            <button onClick={() => handleFilter('status', 'Đã thanh toán')}>
                                Đã thanh toán
                                {filters.status === 'Đã thanh toán' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                            <button onClick={() => handleFilter('status', 'Chưa thanh toán')}>
                                Chưa thanh toán
                                {filters.status === 'Chưa thanh toán' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                        </div>
                        <div className="filter-section">
                            <h4 className="filter-title">Loại hóa đơn</h4>
                            <button onClick={() => handleFilter('type', 'all')}>
                                Tất cả
                                {filters.type === 'all' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                            <button onClick={() => handleFilter('type', 'repair')}>
                                Sửa chữa
                                {filters.type === 'repair' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                            <button onClick={() => handleFilter('type', 'purchase')}>
                                Bán hàng
                                {filters.type === 'purchase' && (
                                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="page__header-search">
                    <FontAwesomeIcon icon={faSearch} className="page__header-icon" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bill-page__content">
                <table className="page-table bill-table">
                    <thead>
                        <tr>
                            <th>Mã hóa đơn</th>
                            <th>Nhân viên</th>
                            <th>Ngày tạo</th>
                            <th>Tổng tiền</th>
                            <th>Loại hóa đơn</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((bill) => (
                            <tr key={bill.id}>
                                <td>{bill.id}</td>
                                <td>{bill.employee?.name || 'Admin'}</td>
                                <td>{new Date(bill.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>đ {bill.total?.toLocaleString()}</td>
                                <td>{bill.type === 'repair' ? 'Sửa chữa' : 'Bán hàng'}</td>
                                <td>
                                    <div
                                        className={`table__status ${
                                            bill.status === 'Đã thanh toán'
                                                ? 'car-normal'
                                                : 'car-completed'
                                        }`}
                                    >
                                        {bill.status}
                                    </div>
                                </td>
                                <td>
                                    <div className="table__actions">
                                        <FontAwesomeIcon
                                            icon={faEllipsisVertical}
                                            className="table__action-icon"
                                        />
                                        <div className="table__action-menu">
                                            <div
                                                className="table__action-item"
                                                onClick={() => {
                                                    setOpenInvoiceModal({
                                                        show: true,
                                                        data: bill.serviceRegister
                                                    })
                                                }}
                                            >
                                                Chi tiết
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <Modal
                isOpen={openInvoiceModal.show}
                onClose={() => setOpenInvoiceModal({ show: false, data: null })}
                showHeader={false}
                width="550px"
            >
                <DetailInvoiceModal
                    onClose={() => setOpenInvoiceModal({ show: false, data: null })}
                    data={openInvoiceModal.data}
                />
            </Modal>
        </div>
    )
}

export default Bill
