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

const Repair = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [openDetailRepairModal, setOpenDetailRepairModal] = useState({
        show: false,
        data: null
    })
    const [openReceiveRepairModal, setOpenReceiveRepairModal] = useState(false)
    const [openInvoiceModal, setOpenInvoiceModal] = useState(false)
    const [repairRegisterData, setRepairRegisterData] = useState([])
    const itemsPerPage = 8

    const fetchData = async () => {
        const data = await dbService.getAll('serviceregisters')
        setRepairRegisterData(data)
    }

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'serviceregisters'), async (snapshot) => {
            await fetchData()
        })
        return () => unsubscribe()
    }, [])

    const totalPages = Math.ceil(repairRegisterData.length / itemsPerPage)

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return repairRegisterData.slice(start, start + itemsPerPage)
    }, [currentPage, repairRegisterData])

    const handlePageChange = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
            }
        },
        [totalPages]
    )

    const onAddService = async (selectedService) => {
        if (
            selectedService !== null &&
            !openDetailRepairModal.data.repairRegisters.some(
                (item) => item.service.id === selectedService.id
            )
        ) {
            const newData = {
                status: 'Đang sửa chữa',
                serviceId: selectedService.id,
                employeeIds: [],
                repairRegisterComponents: []
            }
            const newRepairRegister = await dbService.add('repairregisters', newData)
            await dbService.updateFields('serviceregisters', openDetailRepairModal.data.id, {
                repairRegisterIds: [
                    ...openDetailRepairModal.data.repairRegisterIds,
                    newRepairRegister.id
                ]
            })
        }
    }

    const onDeleteService = async (serviceId) => {
        // Xóa một repairRegister mới và thêm vào registerService
        if (serviceId) {
            const repairRegister = openDetailRepairModal.data?.repairRegisters?.find(
                (item) => item.service.id === serviceId
            )
            await dbService.delete('repairregisters', repairRegister.id)
            // Cập nhật registerService
            await dbService.updateFields('serviceregisters', openDetailRepairModal.data.id, {
                repairRegisterIds: openDetailRepairModal.data.repairRegisterIds.filter(
                    (id) => id !== repairRegister.id
                )
            })
        }
    }

    const onCompleteService = async (serviceId) => {
        if (serviceId) {
            await dbService.updateFields(
                'repairregisters',
                openDetailRepairModal.data?.repairRegisters?.find(
                    (item) => item.service.id === serviceId
                ).id,
                {
                    status: 'Đã hoàn thành'
                }
            )
            await fetchData()
        }
    }

    const onAddComponentUsed = async (repairComponents, serviceId) => {
        if (repairComponents && serviceId) {
            await dbService.updateFields(
                'repairregisters',
                openDetailRepairModal.data.repairRegisters.find(
                    (item) => item.service.id === serviceId
                ).id,
                {
                    repairRegisterComponents: [
                        ...repairComponents.map((item) => ({
                            componentId: item.component.id,
                            quantity: item.quantity
                        }))
                    ]
                }
            )
            await fetchData()
        }
    }

    const onAddStaffInCharge = async (employees, serviceId) => {
        if (employees && serviceId) {
            await dbService.updateFields(
                'repairregisters',
                openDetailRepairModal.data.repairRegisters.find(
                    (item) => item.service.id === serviceId
                ).id,
                {
                    employeeIds: [...employees.map((item) => item.id)]
                }
            )
            await fetchData()
        }
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
                        <input type="text" placeholder="Tìm kiếm" />
                    </div>
                </div>
            </div>
            <div className="repair-page__content">
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
                            <tr key={repair.id}>
                                <td>{repair.id}</td>
                                <td>{repair.employee?.name}</td>
                                <td>{repair.car?.customer?.name}</td>
                                <td>{new Date(repair.createdAt).toLocaleDateString('vi-VN')}</td>
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
                                                (index + 1) % itemsPerPage === 0 ? 'show-top' : ''
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
