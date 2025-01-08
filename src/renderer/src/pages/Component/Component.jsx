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
import { collection, increment, onSnapshot } from 'firebase/firestore'
import Swal from 'sweetalert2'
import Pagination from '../../components/Pagination'
import Modal from '../../components/Modal'
import ImportComponentModal from '../../components/Component/ImportComponentModal'
import { dbService } from '../../services/DatabaseService'
import { db } from '../../firebase.config'
import './Component.css'
import UpDetailComponentModal from '../../components/Component/UpDetailComponentModal'
import DetailImportModal from '../../components/Component/DetailImportModal'
import ComponentUsedModal from '../../components/Repair/ComponentUsedModal'
import { addInputComponentRegister } from '../../controllers/inputComponentRegisterController'
import DetailInvoiceModal from '../../components/Repair/DetailInvoice'
import { useParameters } from '../../contexts/ParameterContext'

function Component() {
    const [currentPage, setCurrentPage] = useState(1)
    const [tab, setTab] = useState('component')
    const [openImportModal, setOpenImportModal] = useState({
        show: false,
        data: null
    })
    const [openComponent, setOpenComponent] = useState({
        type: 'detail',
        data: null,
        show: false
    })
    const [openDetailImportModal, setOpenDetailImportModal] = useState({
        data: null,
        show: false
    })
    const [openPurchase, setOpenPurchase] = useState(false)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const itemsPerPage = 8
    const [sortField, setSortField] = useState(null)
    const [sortDirection, setSortDirection] = useState('desc')
    const [filters, setFilters] = useState({
        storagePosition: 'all',
        category: 'all'
    })
    const [originalData, setOriginalData] = useState([])
    const [categories, setCategories] = useState([])
    const [showInvoice, setShowInvoice] = useState({
        show: false,
        data: null
    })
    const { parameters } = useParameters()
    const profitRate = parameters[0]?.value || 1.25

    const fetchData = async () => {
        const data =
            tab === 'component'
                ? await dbService.getAll(
                      'components',
                      JSON.parse(localStorage.getItem('currentGarage'))?.id
                  )
                : await dbService.getAll(
                      'inputcomponentregisters',
                      JSON.parse(localStorage.getItem('currentGarage'))?.id
                  )
        setData(data)
        setOriginalData(data)
    }

    useEffect(() => {
        setIsLoading(true)
        const collectionName = tab === 'component' ? 'components' : 'inputcomponentregisters'
        const unsubscribe = onSnapshot(collection(db, collectionName), async () => {
            try {
                await fetchData()
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        })
        return () => unsubscribe()
    }, [tab])

    const totalPages = Math.ceil(data.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return data.slice(start, start + itemsPerPage)
    }, [currentPage, data])

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    const handleDeleteComponent = async (componentId) => {
        Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: `Bạn có muốn xóa phụ tùng không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await dbService.softDelete('components', componentId)
                Swal.fire({
                    title: 'Đã xóa!',
                    text: `Phụ tùng đã được xóa.`,
                    icon: 'success'
                })
            }
        })
    }

    const handleSort = (field) => {
        let newDirection
        if (field === sortField) {
            if (sortDirection === 'desc') {
                newDirection = 'asc'
            } else {
                setSortField(null)
                setSortDirection('desc')
                setData([...originalData])
                return
            }
        } else {
            newDirection = 'desc'
        }

        setSortField(field)
        setSortDirection(newDirection)

        const sorted = [...data].sort((a, b) => {
            if (!a[field] || !b[field]) return 0

            if (field === 'inventory' || field === 'price') {
                const numA = parseFloat(a[field]) || 0
                const numB = parseFloat(b[field]) || 0
                return newDirection === 'desc' ? numB - numA : numA - numB
            }

            const valueA = String(a[field] || '').toLowerCase()
            const valueB = String(b[field] || '').toLowerCase()
            return newDirection === 'desc'
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB)
        })

        setData(sorted)
    }

    const handleFilter = (type, value) => {
        console.log('Filter type:', type)
        console.log('Filter value:', value)
        console.log('Current filters:', filters)

        setFilters((prev) => ({ ...prev, [type]: value }))

        let filtered = [...originalData]
        console.log('Data before filter:', filtered)

        if (type === 'storagePosition') {
            if (value !== 'all') {
                filtered = filtered.filter((component) => component.storagePosition === value)
            }
            // Giữ lại filter category nếu đang có
            if (filters.category !== 'all') {
                filtered = filtered.filter((component) => {
                    console.log('Component category:', component.category)
                    return component.category?.id === filters.category
                })
            }
        }

        if (type === 'category') {
            if (value !== 'all') {
                filtered = filtered.filter((component) => {
                    console.log('Component category:', component.category)
                    return component.category?.id === value
                })
            }
            // Giữ lại filter storagePosition nếu đang có
            if (filters.storagePosition !== 'all') {
                filtered = filtered.filter(
                    (component) => component.storagePosition === filters.storagePosition
                )
            }
        }

        console.log('Filtered data:', filtered)
        setData(filtered)
    }

    const fetchCategories = async () => {
        try {
            const categoriesData = await dbService.getAll(
                'categories',
                JSON.parse(localStorage.getItem('currentGarage'))?.id
            )
            setCategories(categoriesData)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        console.log('Categories:', categories)
        console.log('Original Data:', originalData)
        console.log('Current Data:', data)
    }, [categories, originalData, data])

    const handlePurchase = async (data) => {
        if (data.length > 0) {
            const total = data.reduce((total, item) => {
                return total + Number(item.component.price) * Number(item.quantity) * profitRate
            }, 0)

            const repairRegister = {
                status: 'Đã hoàn thành',
                serviceId: 'WJu9TV0IyIwaLcVlIVLc',
                employeeIds: [],
                repairRegisterComponents: data.map((item) => ({
                    componentId: item.component.id,
                    quantity: item.quantity
                }))
            }
            const newRepairRegister = await dbService.add('repairregisters', repairRegister)
            const serviceRegister = {
                employeeId: JSON.parse(localStorage.getItem('currentUser')).employee?.id || 'admin',
                carId: null,
                status: 'Đã hoàn thành',
                expectedCompletionDate: new Date().toISOString(),
                repairRegisterIds: [newRepairRegister.id],
                garageId: JSON.parse(localStorage.getItem('currentGarage'))?.id
            }
            const newServiceRegister = await dbService.add('serviceregisters', serviceRegister)
            data.forEach(async (item) => {
                await dbService.update('components', item.component.id, {
                    inventory: increment(Number(item.quantity) * -1)
                })
            })
            const newBill = await dbService.add('bills', {
                employeeId: JSON.parse(localStorage.getItem('currentUser')).employee?.id,
                customerId: null,
                total: total,
                serviceRegisterId: newServiceRegister.id,
                status: 'Chưa thanh toán',
                type: 'purchase',
                garageId: JSON.parse(localStorage.getItem('currentGarage'))?.id
            })
            const newBillData = await dbService.getById('bills', newBill.id)
            await Swal.fire({
                title: 'Thành công',
                text: 'Tạo phiếu mua hàng thành công',
                icon: 'success',
                confirmButtonText: 'OK'
            })
            setShowInvoice({
                show: true,
                data: newBillData?.serviceRegister
            })
        }
    }

    return (
        <>
            <div className="main-container">
                <div className="headerr">
                    <div className="btn-area">
                        <button
                            className={`tab-btn ${tab === 'component' ? 'active' : ''}`}
                            onClick={() => setTab('component')}
                        >
                            Kho Phụ Tùng
                        </button>
                        <button
                            className={`tab-btn ${tab === 'import' ? 'active' : ''}`}
                            onClick={() => setTab('import')}
                        >
                            Phiếu Nhập Kho
                        </button>
                    </div>
                    <div className="z-btn-center-buy">
                        <button
                            className="primary-button"
                            onClick={() => {
                                tab === 'component'
                                    ? setOpenPurchase(true)
                                    : setOpenImportModal({
                                          show: true,
                                          data: null
                                      })
                            }}
                        >
                            {tab === 'component' ? 'Mua Hàng' : 'Nhập Kho'}
                        </button>
                    </div>

                    <div className="filter-area">
                        <div className="dropdown">
                            <button className={`page__header-button ${sortField ? 'active' : ''}`}>
                                <FontAwesomeIcon
                                    icon={faArrowUpWideShort}
                                    className="page__header-icon"
                                />
                                Sắp xếp{' '}
                                {sortField &&
                                    `(${
                                        sortField === 'inventory'
                                            ? 'Số lượng'
                                            : sortField === 'price'
                                              ? 'Đơn giá'
                                              : 'Mã phụ tùng'
                                    } ${sortDirection === 'asc' ? '↑' : '↓'})`}
                                <FontAwesomeIcon icon={faCaretDown} className="page__header-icon" />
                            </button>
                            <div className="dropdown-content">
                                <div>
                                    <h4 className="filter-title">Sắp xếp theo</h4>
                                    <button onClick={() => handleSort('inventory')}>
                                        Số lượng
                                        {sortField === 'inventory' && (
                                            <FontAwesomeIcon
                                                icon={
                                                    sortDirection === 'asc'
                                                        ? faArrowUp
                                                        : faArrowDown
                                                }
                                                className="sort-direction-icon"
                                            />
                                        )}
                                    </button>
                                    <button onClick={() => handleSort('price')}>
                                        Đơn giá
                                        {sortField === 'price' && (
                                            <FontAwesomeIcon
                                                icon={
                                                    sortDirection === 'asc'
                                                        ? faArrowUp
                                                        : faArrowDown
                                                }
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
                                    filters.storagePosition !== 'all' || filters.category !== 'all'
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
                                Lọc{' '}
                                {(filters.storagePosition !== 'all' ||
                                    filters.category !== 'all') &&
                                    `(${[
                                        filters.storagePosition !== 'all'
                                            ? filters.storagePosition
                                            : '',
                                        filters.category !== 'all'
                                            ? categories.find((c) => c.id === filters.category)
                                                  ?.name
                                            : ''
                                    ]
                                        .filter(Boolean)
                                        .join(', ')})`}
                                <FontAwesomeIcon icon={faCaretDown} className="page__header-icon" />
                            </button>
                            <div className="dropdown-content">
                                <div className="filter-section">
                                    <h4 className="filter-title">Kho hàng</h4>
                                    <button onClick={() => handleFilter('storagePosition', 'all')}>
                                        Tất cả
                                        {filters.storagePosition === 'all' && (
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="filter-icon"
                                            />
                                        )}
                                    </button>
                                    <button onClick={() => handleFilter('storagePosition', 'B1')}>
                                        Kho B1
                                        {filters.storagePosition === 'B1' && (
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="filter-icon"
                                            />
                                        )}
                                    </button>
                                    <button onClick={() => handleFilter('storagePosition', 'B2')}>
                                        Kho B2
                                        {filters.storagePosition === 'B2' && (
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="filter-icon"
                                            />
                                        )}
                                    </button>
                                    <button onClick={() => handleFilter('storagePosition', 'B3')}>
                                        Kho B3
                                        {filters.storagePosition === 'B3' && (
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="filter-icon"
                                            />
                                        )}
                                    </button>
                                </div>
                                <div className="filter-section">
                                    <h4 className="filter-title">Loại phụ tùng</h4>
                                    <button onClick={() => handleFilter('category', 'all')}>
                                        Tất cả
                                        {filters.category === 'all' && (
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                className="filter-icon"
                                            />
                                        )}
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleFilter('category', category.id)}
                                        >
                                            {category.name}
                                            {filters.category === category.id && (
                                                <FontAwesomeIcon
                                                    icon={faFilter}
                                                    className="filter-icon"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="employee-table">
                    <div className="z-car-page">
                        <div className="z-car-page__content overflow-visible">
                            {isLoading ? (
                                <div className="d-flex justify-content-center">
                                    <p>Đang tải...</p>
                                </div>
                            ) : tab === 'component' ? (
                                <table className="page-table car-table">
                                    <thead>
                                        <tr>
                                            <th>Thứ tự</th>
                                            <th>Mã phụ tùng</th>
                                            <th>Tên phụ tùng</th>
                                            <th>Loại phụ tùng</th>
                                            <th>Số lượng</th>
                                            <th>Đơn giá</th>
                                            <th>Kho hàng</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((component, index) => (
                                            <tr key={component.id}>
                                                <td>
                                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                                </td>
                                                <td>{component.id}</td>
                                                <td>{component.name}</td>
                                                <td>{component.category?.name}</td>
                                                <td>{component.inventory}</td>
                                                <td>
                                                    {component.price
                                                        ? component.price.toLocaleString('vi-VN', {
                                                              style: 'currency',
                                                              currency: 'VND'
                                                          })
                                                        : ''}
                                                </td>
                                                <td>{component.storagePosition}</td>

                                                <td className="overflow-visible">
                                                    <div className="table__actions">
                                                        <FontAwesomeIcon
                                                            icon={faEllipsisVertical}
                                                            className="table__action-icon"
                                                        />
                                                        <div
                                                            className={`table__action-menu ${
                                                                (index + 1) % itemsPerPage === 0
                                                                    ? 'show-top'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <div
                                                                className="table__action-item"
                                                                onClick={() => {
                                                                    setOpenComponent({
                                                                        type: 'detail',
                                                                        show: true,
                                                                        data: component
                                                                    })
                                                                }}
                                                            >
                                                                Chi tiết
                                                            </div>
                                                            <div
                                                                className="table__action-item"
                                                                onClick={() => {
                                                                    setOpenComponent({
                                                                        type: 'update',
                                                                        show: true,
                                                                        data: component
                                                                    })
                                                                }}
                                                            >
                                                                Cập nhật
                                                            </div>
                                                            <div
                                                                className="table__action-item"
                                                                onClick={() =>
                                                                    handleDeleteComponent(
                                                                        component.id
                                                                    )
                                                                }
                                                            >
                                                                Xóa
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="page-table car-table">
                                    <thead>
                                        <tr>
                                            <th>Mã phiếu nhập</th>
                                            <th>Tên nhân viên nhập</th>
                                            <th>Ngày lập phiếu</th>
                                            <th>Số lượng nhập</th>
                                            <th>Thanh toán</th>
                                            <th>Nhà cung cấp</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((register, index) => (
                                            <tr key={register?.id}>
                                                <td>{register?.id}</td>
                                                <td>{register?.employee?.name}</td>
                                                <td>
                                                    {new Date(
                                                        register?.createdAt
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {register?.details?.reduce(
                                                        (total, detail) => total + detail.quantity,
                                                        0
                                                    )}
                                                </td>
                                                <td>
                                                    {register?.details
                                                        ?.reduce(
                                                            (total, detail) =>
                                                                total +
                                                                detail.quantity * detail.inputPrice,
                                                            0
                                                        )
                                                        .toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })}
                                                </td>
                                                <td>{register.supplier?.name}</td>
                                                <td className="overflow-visible">
                                                    <div className="table__actions">
                                                        <FontAwesomeIcon
                                                            icon={faEllipsisVertical}
                                                            className="table__action-icon"
                                                        />
                                                        <div
                                                            className={`table__action-menu ${
                                                                (index + 1) % itemsPerPage === 0
                                                                    ? 'show-top'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <div
                                                                className="table__action-item"
                                                                onClick={() =>
                                                                    setOpenDetailImportModal({
                                                                        data: register,
                                                                        show: true
                                                                    })
                                                                }
                                                            >
                                                                Chi tiết
                                                            </div>
                                                            <div
                                                                className="table__action-item"
                                                                onClick={() => {
                                                                    setOpenImportModal({
                                                                        show: true,
                                                                        data: register
                                                                    })
                                                                }}
                                                            >
                                                                Cập nhật
                                                            </div>
                                                            <div className="table__action-item">
                                                                Xóa
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
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
            <Modal
                width="900px"
                showHeader={true}
                title={
                    openImportModal.data === null
                        ? 'Thêm phiếu nhập kho'
                        : 'Cập nhật phiếu nhập kho'
                }
                isOpen={openImportModal.show}
                onClose={() =>
                    setOpenImportModal({
                        show: false,
                        data: null
                    })
                }
            >
                <ImportComponentModal
                    onClose={() =>
                        setOpenImportModal({
                            show: false,
                            data: null
                        })
                    }
                    data={openImportModal.data}
                />
            </Modal>
            <Modal
                width="700px"
                showHeader={true}
                title={openComponent.type === 'detail' ? 'Chi tiết phụ tùng' : 'Cập nhật phụ tùng'}
                isOpen={openComponent.show}
                onClose={() =>
                    setOpenComponent((pre) => ({
                        ...pre,
                        show: false,
                        data: null
                    }))
                }
            >
                <UpDetailComponentModal
                    type={openComponent.type}
                    data={openComponent.data}
                    onClose={() =>
                        setOpenComponent((pre) => ({
                            ...pre,
                            show: false,
                            data: null
                        }))
                    }
                />
            </Modal>
            <Modal
                width="700px"
                showHeader={true}
                title="Chi tiết phiếu nhập kho"
                isOpen={openDetailImportModal.show}
                onClose={() =>
                    setOpenDetailImportModal({
                        data: null,
                        show: false
                    })
                }
            >
                <DetailImportModal
                    data={openDetailImportModal.data}
                    onClose={() =>
                        setOpenDetailImportModal({
                            data: null,
                            show: false
                        })
                    }
                />
            </Modal>
            <Modal
                width="900px"
                showHeader={true}
                title="Chi tiết phụ tùng sử dụng mua hàng"
                isOpen={openPurchase}
                onClose={() => setOpenPurchase(false)}
            >
                <ComponentUsedModal
                    onClose={() => setOpenPurchase(false)}
                    onAddComponentUsed={handlePurchase}
                    data={null}
                />
            </Modal>
            <Modal
                width="550px"
                showHeader={false}
                isOpen={showInvoice.show}
                onClose={() => setShowInvoice({ show: false, data: null })}
            >
                <DetailInvoiceModal
                    data={showInvoice.data}
                    onClose={() => setShowInvoice({ show: false, data: null })}
                />
            </Modal>
        </>
    )
}

export default Component
