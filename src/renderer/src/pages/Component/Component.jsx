import { useState, useMemo, useCallback, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical
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

    const fetchData = async () => {
        const data =
            tab === 'component'
                ? await dbService.getAll('components')
                : await dbService.getAll('inputcomponentregisters')
        setData(data)
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
                        <button className="page__header-button">
                            <FontAwesomeIcon
                                icon={faArrowUpWideShort}
                                className="page__header-icon"
                            />
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
                    onAddComponentUsed={async (data) => {
                        if (data.length > 0) {
                            const repairRegister = {
                                status: 'Đã hoàn thành',
                                serviceId: 'WJu9TV0IyIwaLcVlIVLc',
                                employeeIds: [],
                                repairRegisterComponents: data.map((item) => ({
                                    componentId: item.component.id,
                                    quantity: item.quantity
                                }))
                            }
                            const newRepairRegister = await dbService.add(
                                'repairregisters',
                                repairRegister
                            )
                            const serviceRegister = {
                                employeeId: JSON.parse(localStorage.getItem('currentUser')).employee
                                    ?.id,
                                carId: null,
                                status: 'Đã hoàn thành',
                                expectedCompletionDate: new Date().toISOString(),
                                repairRegisterIds: [newRepairRegister.id]
                            }
                            // const newServiceRegister = await dbService.add(
                            //     'serviceregisters',
                            //     serviceRegister
                            // )
                            const newServiceRegister = await addServiceRegister(serviceRegister)
                            data.forEach(async (item) => {
                                await dbService.update('components', item.component.id, {
                                    inventory: increment(Number(item.quantity) * -1)
                                })
                            })
                            await dbService.add('bills', {
                                employeeId: JSON.parse(localStorage.getItem('currentUser')).employee
                                    ?.id,
                                customerId: null,
                                total: data.reduce((total, item) => {
                                    return (
                                        total + Number(item.component.price) * Number(item.quantity)
                                    )
                                }, 0),
                                serviceRegisterId: newServiceRegister.id,
                                status: 'Đã thanh toán',
                                type: 'purchase'
                            })
                            await Swal.fire({
                                title: 'Thành công',
                                text: 'Tạo phiếu mua hàng thành công',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            })
                        }
                    }}
                    data={null}
                />
            </Modal>
        </>
    )
}

export default Component
