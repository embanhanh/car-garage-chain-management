import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

const StaffInChargeModal = ({ onClose }) => {
    return (
        <div className="staff-in-charge-modal">
            <div className="staff-in-charge-modal__add-staff">
                <div className="repair-modal__input-item mb-3">
                    <label htmlFor="staffCode">Mã nhân viên</label>
                    <div className="input-form">
                        <input className="w-100" type="text" id="staffCode" placeholder="NV008" />
                    </div>
                </div>
                <div className="repair-modal__input-item mb-3">
                    <label htmlFor="staffName">Tên nhân viên</label>
                    <div className="input-form">
                        <input
                            className="w-100"
                            type="text"
                            id="staffName"
                            placeholder="Nguyễn Văn B"
                            disabled
                        />
                    </div>
                </div>
                <div className="repair-modal__input-item mb-3">
                    <label htmlFor="staffPhone">Số điện thoại</label>
                    <div className="input-form">
                        <input
                            className="w-100"
                            type="text"
                            id="staffPhone"
                            placeholder="0909090909"
                        />
                    </div>
                </div>
                <div className="staff-in-charge__actions">
                    <button className="repair-modal__button cancel-button" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="repair-modal__button confirm-button">Thêm</button>
                </div>
            </div>
            <div className="repair-modal__separate mr-3 ml-3"></div>
            <div className="repair-modal__table-container">
                <h3 className="repair-modal__table-title">Danh sách nhân viên phụ trách</h3>
                <div className="repair-modal__table-content">
                    <table className="page-table staff-in-charge-table">
                        <thead>
                            <tr>
                                <th>Thứ tự</th>
                                <th>Tên nhân viên</th>
                                <th>Số điện thoại</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Nguyễn Văn B</td>
                                <td>0909090909</td>
                                <td>
                                    <div className="table__actions">
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
                    <button className="repair-modal__button confirm-button">Xác nhận</button>
                </div>
            </div>
        </div>
    )
}

export default StaffInChargeModal
