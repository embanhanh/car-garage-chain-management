import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import UpdateComponent from './UpdateComponent'
import Modal from '../Modal'

const ComponentUsedModal = ({ onClose }) => {
    const [openUpdateComponentModal, setOpenUpdateComponentModal] = useState(false)
    return (
        <>
            <div className="component-used-modal">
                <div className="component-used-modal__add-component">
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="componentCode">Mã phụ tùng</label>
                        {/* <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="componentCode"
                                placeholder="PCS001"
                            />
                        </div> */}
                        <select id="province" value={''} className={`combo-box`}>
                            <option value="" disabled hidden>
                                Chọn
                            </option>
                            <option>test</option>
                        </select>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="componentType">Loại phụ tùng</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="componentType"
                                placeholder="Phụ tùng động cơ"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="componentName">Tên phụ tùng</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="componentName"
                                placeholder="Bộ lọc gió động cơ"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="quantity">Số lượng</label>
                        <div className="input-form">
                            <input className="w-100" type="number" id="quantity" placeholder="1" />
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
                    <h3 className="repair-modal__table-title">Danh sách phụ tùng sử dụng</h3>
                    <div className="repair-modal__table-content">
                        <table className="page-table component-used-table">
                            <thead>
                                <tr>
                                    <th>Mã phụ tùng</th>
                                    <th>Tên phụ tùng</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>PCS001</td>
                                    <td>Bộ lọc gió động cơ</td>
                                    <td>1</td>
                                    <td>100.000</td>
                                    <td>100.000</td>
                                    <td>
                                        <div
                                            className="table__actions"
                                            onClick={() => setOpenUpdateComponentModal(true)}
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
                        <button className="repair-modal__button confirm-button">Xác nhận</button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openUpdateComponentModal}
                onClose={() => setOpenUpdateComponentModal(false)}
                showHeader={false}
                width="500px"
            >
                <UpdateComponent onClose={() => setOpenUpdateComponentModal(false)} />
            </Modal>
        </>
    )
}

export default ComponentUsedModal
