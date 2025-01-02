import { useState, useMemo, useCallback, useEffect } from 'react'
import {
    faArrowUpWideShort,
    faFilter,
    faSearch,
    faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { dbService } from '../../services/DatabaseService'
import { doc, onSnapshot, collection } from 'firebase/firestore'
import Pagination from '../../components/Pagination'
import './Repair.css'
import Modal from '../../components/Modal'
import ReceiveRepairModal from '../../components/Repair/ReceiveRepairModal'
import DetailRepairModal from '../../components/Repair/DetailRepairModal'
import DetailInvoiceModal from '../../components/Repair/DetailInvoice'
import { db } from '../../firebase.config'
import {
    addService,
    deleteService,
    completeService,
    addComponentUsed,
    addStaffInCharge
} from '../../controllers/repairController'

const Repair = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [openDetailRepairModal, setOpenDetailRepairModal] = useState({
        show: false,
        data: null
    })
    const [openReceiveRepairModal, setOpenReceiveRepairModal] = useState(false)
    const [openInvoiceModal, setOpenInvoiceModal] = useState(false)
    const [repairRegisterData, setRepairRegisterData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const itemsPerPage = 8
    const [searchTerm, setSearchTerm] = useState('')

    const fetchData = async () => {
        const data = await dbService.getAll('serviceregisters')
        setRepairRegisterData(data)
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'serviceregisters'), async (snapshot) => {
            try {
                setIsLoading(true)
                await fetchData()
            } catch (e) {
                console.log(e)
            } finally {
                setIsLoading(false)
            }
        })
        return () => unsubscribe()
    }, [])

    const searchedRepairs = useMemo(() => {
        if (!searchTerm) return repairRegisterData

        const searchLower = searchTerm.toLowerCase().trim()

        return repairRegisterData.filter((repair) => {
            if (repair.id.toLowerCase().includes(searchLower)) return true

            if (repair.car?.customer?.name.toLowerCase().includes(searchLower)) return true

            if (repair.car?.licensePlate.toLowerCase().includes(searchLower)) return true

            if (repair.employee?.name.toLowerCase().includes(searchLower)) return true

            return false
        })
    }, [repairRegisterData, searchTerm])

    const totalPages = Math.ceil(searchedRepairs.filter((item) => item.car).length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return searchedRepairs.filter((item) => item.car).slice(start, start + itemsPerPage)
    }, [currentPage, searchedRepairs])

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    const onAddService = async (selectedService) => {
        await addService(selectedService, openDetailRepairModal)
    }

    const onDeleteService = async (serviceId) => {
        await deleteService(serviceId, openDetailRepairModal)
    }

    const onCompleteService = async (serviceId) => {
        await completeService(serviceId, openDetailRepairModal, fetchData)
    }

    const onAddComponentUsed = async (repairComponents, serviceId) => {
        await addComponentUsed(repairComponents, serviceId, openDetailRepairModal, fetchData)
    }

    const onAddStaffInCharge = async (employees, serviceId) => {
        await addStaffInCharge(employees, serviceId, openDetailRepairModal, fetchData)
    }

    useEffect(() => {
        console.log(repairRegisterData)
        if (openDetailRepairModal.data && openDetailRepairModal.show) {
            setOpenDetailRepairModal((pre) => ({
                ...pre,
                data: repairRegisterData.find((item) => item.id === pre.data.id)
            }))
        }
    }, [repairRegisterData])

    return (
        <div className="repair-page">
            <div className="repair-page__header">
                <button
                    className="repair-page__header-button"
                    onClick={() => setOpenReceiveRepairModal(true)}
                >
                    <p>Tiếp nhận sửa chữa</p>
                </button>
                <div className="repair-page__header-filter">
                    <button className="page__header-button">
                        <FontAwesomeIcon icon={faArrowUpWideShort} className="page__header-icon" />
                        Sắp xếp
                    </button>
                    <button
                        className="page__header-button"
                        onClick={() => setOpenInvoiceModal(true)}
                    >
                        <FontAwesomeIcon icon={faFilter} className="page__header-icon" />
                        Lọc
                    </button>
                    <div className="page__header-search">
                        <FontAwesomeIcon icon={faSearch} className="page__header-icon" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã phiếu, tên khách hàng, biển số xe..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="repair-page__content">
                {isLoading ? (
                    <div className="d-flex justify-content-center">
                        <p>Đang tải...</p>
                    </div>
                ) : (
                    <table className="page-table repair-table">
                        <thead>
                            <tr>
                                <th>Mã phiếu</th>
                                <th>Nhân viên nhập</th>
                                <th>Khách hàng</th>
                                <th>Ngày tạo phiếu</th>
                                <th>Biển số xe</th>
                                <th>Ngày hoàn thành</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((repair, index) => (
                                <tr key={index}>
                                    <td>{repair.id}</td>
                                    <td>{repair.employee?.name}</td>
                                    <td>{repair.car?.customer?.name}</td>
                                    <td>
                                        {new Date(repair.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td>{repair.car?.licensePlate}</td>
                                    <td>
                                        {new Date(repair.expectedCompletionDate).toLocaleDateString(
                                            'vi-VN'
                                        )}
                                    </td>
                                    <td>
                                        <div
                                            className={`table__status ${repair.status === 'Đang sửa chữa' ? 'car-completed' : 'car-normal'}`}
                                        >
                                            {repair.status}
                                        </div>
                                    </td>
                                    <td>
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
                                                        setOpenDetailRepairModal({
                                                            show: true,
                                                            data: repair
                                                        })
                                                    }
                                                >
                                                    Chi tiết
                                                </div>

                                                <div
                                                    className="table__action-item"
                                                    onClick={async () => {
                                                        await dbService.softDelete(
                                                            'serviceregisters',
                                                            repair.id
                                                        )
                                                    }}
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
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <Modal
                isOpen={openReceiveRepairModal}
                onClose={() => setOpenReceiveRepairModal(false)}
                showHeader={false}
                width="800px"
            >
                <ReceiveRepairModal onClose={() => setOpenReceiveRepairModal(false)} />
            </Modal>
            <Modal
                isOpen={openDetailRepairModal.show}
                onClose={() =>
                    setOpenDetailRepairModal({
                        show: false,
                        data: null
                    })
                }
                showHeader={false}
                width="800px"
            >
                <DetailRepairModal
                    onClose={() =>
                        setOpenDetailRepairModal({
                            show: false,
                            data: null
                        })
                    }
                    data={openDetailRepairModal.data}
                    onAddComponentUsed={onAddComponentUsed}
                    onAddService={onAddService}
                    onDeleteService={onDeleteService}
                    onAddStaffInCharge={onAddStaffInCharge}
                    onCompleteService={onCompleteService}
                />
            </Modal>
            <Modal
                isOpen={openInvoiceModal}
                onClose={() => setOpenInvoiceModal(false)}
                showHeader={false}
                width="550px"
            >
                <DetailInvoiceModal onClose={() => setOpenDetailRepairModal(false)} />
            </Modal>
        </div>
    )
}

export default Repair
