import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Modal from '../Modal'
import StaffInChargeModal from './StaffInChargeModal'
import ComponentUsedModal from './ComponentUsedModal'
import AddRepairRegisterModal from './AddRepairRegisterModal'
import { query, getDocs, collection, where } from 'firebase/firestore'
import { db } from '../../firebase.config'

function DetailRepairModal({
    onClose,
    data,
    onAddService,
    onDeleteService,
    onAddStaffInCharge,
    onAddComponentUsed,
    onCompleteService,
    type
}) {
    const [repairData, setRepairData] = useState(data)
    const [isPaid, setIsPaid] = useState(false)
    const [openStaffInChargeModal, setOpenStaffInChargeModal] = useState({
        show: false,
        data: null
    })
    const [openComponentUsedModal, setOpenComponentUsedModal] = useState({
        show: false,
        data: null
    })
    const [openAddRepairRegisterModal, setOpenAddRepairRegisterModal] = useState(false)

    useEffect(() => {
        setRepairData(data)
        if (data.id) {
            const getIsPaid = async () => {
                const q = query(collection(db, 'bills'), where('serviceRegisterId', '==', data.id))
                const querySnapshot = await getDocs(q)
                if (querySnapshot.docs.length > 0) {
                    setIsPaid(true)
                }
            }
            getIsPaid()
        }
    }, [data])

    return (
        <>
            <div className="modal-header">
                <h2 className="modal-title">Chi tiết phiếu dịch vụ</h2>
                <button className="modal-close" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div className="detail-repair-modal w-100 h-100">
                <div className="detail-repair-modal__car-info">
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="carNumber">Biển số xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="carNumber"
                                placeholder="51A-12345"
                                disabled
                                value={repairData?.car?.licensePlate}
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="customerName">Tên khách hàng</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="customerName"
                                placeholder="Trần Văn A"
                                disabled
                                value={repairData?.car?.customer?.name}
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="carModel">Mẫu xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="carModel"
                                placeholder="Toyota Vios"
                                disabled
                                value={repairData?.car?.model}
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="carBrand">Hãng xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="carBrand"
                                placeholder="Toyota"
                                disabled
                                value={repairData?.car?.brand}
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="expectedCompletionDate">Ngày dự kiến hoàn thành</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="expectedCompletionDate"
                                placeholder="12/12/2024"
                                disabled
                                value={new Date(
                                    repairData?.expectedCompletionDate
                                ).toLocaleDateString('en-GB')}
                            />
                            <FontAwesomeIcon icon={faCalendar} className="input-form__icon" />
                        </div>
                    </div>
                </div>
                <div className="detail-repair-modal__separate mr-3 ml-3"></div>
                <div className="detail-repair-modal__repair-info pt-2 pb-2 pr-2">
                    <div className="detail-repair-modal__register-type">
                        <button className="register-type-tab active mr-3">Sửa chữa</button>
                        <button className="register-type-tab">Bảo dưỡng</button>
                    </div>
                    <div className="repair-modal__table-container">
                        <h3 className="repair-modal__table-title mt-2">
                            Danh sách loại hình sửa chữa
                        </h3>
                        <div className="repair-modal__table-content">
                            <table className="page-table detail-repair-table table-scrollable">
                                <thead>
                                    <tr>
                                        <th>Thứ tự</th>
                                        <th>Loại hình sửa chữa</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {repairData?.repairRegisters?.map((register, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{register.service.name}</td>
                                            <td>
                                                <div
                                                    className={`table__status ${register.status === 'Đang sửa chữa' ? 'car-completed' : 'car-normal'}`}
                                                >
                                                    {register.status}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="table__actions">
                                                    <FontAwesomeIcon
                                                        icon={faEllipsisVertical}
                                                        className="table__action-icon"
                                                    />
                                                    <div className={`table__action-menu `}>
                                                        <div
                                                            className="table__action-item"
                                                            onClick={() =>
                                                                setOpenStaffInChargeModal({
                                                                    show: true,
                                                                    data: register
                                                                })
                                                            }
                                                        >
                                                            Chi tiết nhân viên
                                                        </div>
                                                        <div
                                                            className="table__action-item"
                                                            onClick={() =>
                                                                setOpenComponentUsedModal({
                                                                    show: true,
                                                                    data: register
                                                                })
                                                            }
                                                        >
                                                            Chi tiết phụ tùng
                                                        </div>
                                                        {register.status === 'Đang sửa chữa' &&
                                                            type !== 'add' && (
                                                                <div
                                                                    className="table__action-item"
                                                                    onClick={async () =>
                                                                        await onCompleteService(
                                                                            register.service.id
                                                                        )
                                                                    }
                                                                >
                                                                    Hoàn thành
                                                                </div>
                                                            )}
                                                        {register.status === 'Đang sửa chữa' && (
                                                            <div
                                                                className="table__action-item"
                                                                onClick={async () =>
                                                                    await onDeleteService(
                                                                        register.service.id
                                                                    )
                                                                }
                                                            >
                                                                Xóa
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="repair-modal__btn-container">
                            <button
                                className="repair-modal__button confirm-button"
                                onClick={() => setOpenAddRepairRegisterModal(true)}
                                disabled={isPaid}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openStaffInChargeModal.show}
                showHeader={true}
                title="Chi tiết nhân viên phụ trách"
                width="720px"
                onClose={() => setOpenStaffInChargeModal({ show: false, data: null })}
            >
                <StaffInChargeModal
                    onClose={() => setOpenStaffInChargeModal({ show: false, data: null })}
                    data={openStaffInChargeModal.data}
                    onAddStaffInCharge={onAddStaffInCharge}
                />
            </Modal>
            <Modal
                isOpen={openComponentUsedModal.show}
                showHeader={true}
                title="Chi tiết phụ tùng sử dụng"
                width="900px"
                onClose={() =>
                    setOpenComponentUsedModal({
                        show: false,
                        data: null
                    })
                }
            >
                <ComponentUsedModal
                    onClose={() =>
                        setOpenComponentUsedModal({
                            show: false,
                            data: null
                        })
                    }
                    data={openComponentUsedModal.data}
                    onAddComponentUsed={onAddComponentUsed}
                />
            </Modal>
            <Modal
                isOpen={openAddRepairRegisterModal}
                showHeader={true}
                title="Thêm loại hình dịch vụ"
                onClose={() => setOpenAddRepairRegisterModal(false)}
                width="700px"
            >
                <AddRepairRegisterModal
                    onClose={() => setOpenAddRepairRegisterModal(false)}
                    onAddService={onAddService}
                />
            </Modal>
        </>
    )
}

export default DetailRepairModal
