import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Modal from '../Modal'
import StaffInChargeModal from './StaffInChargeModal'

function DetailRepairModal({ onClose }) {
    const [openStaffInChargeModal, setOpenStaffInChargeModal] = useState(false)
    return (
        <>
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
                            <table className="page-table detail-repair-table">
                                <thead>
                                    <tr>
                                        <th>Thứ tự</th>
                                        <th>Loại hình sửa chữa</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Thay bộ lọc động cơ</td>
                                        <td>
                                            <div
                                                className="table__actions"
                                                onClick={() => setOpenStaffInChargeModal(true)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                    className="table__action-icon"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="repair-modal__btn-container">
                            <button className="repair-modal__button confirm-button">Thêm</button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={openStaffInChargeModal} showHeader={false} width="720px">
                <StaffInChargeModal onClose={() => setOpenStaffInChargeModal(false)} />
            </Modal>
        </>
    )
}

export default DetailRepairModal
