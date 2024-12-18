export default function ReceiveRepairModal({ onClose }) {
    return (
        <>
            <div className="w-100 h-100 repair-modal">
                <h2 className="repair-modal__title">Thông tin khách hàng</h2>
                <div className="repair-modal__client-info">
                    <div className="repair-modal__input-item">
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="phoneNumber"
                                placeholder="0913123123"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="customerName">Tên khách hàng</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="customerName"
                                placeholder="Trần Văn A"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="email">Email</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="email"
                                placeholder="tranvana@gmail.com"
                            />
                        </div>
                    </div>
                </div>
                <div className="repair-modal__client-info">
                    <div className="repair-modal__input-item">
                        <label htmlFor="birthday">Ngày sinh</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="date"
                                id="birthday"
                                placeholder="01/01/1990"
                            />
                            {/* <FontAwesomeIcon icon={faCalendar} className="input-form__icon" /> */}
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="cccd">CCCD</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="cccd"
                                placeholder="123456789012"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="address">Địa chỉ</label>
                        <div className="input-form ">
                            <input
                                className="w-100"
                                type="text"
                                id="address"
                                placeholder="123 Nguyễn Văn A, Quận B, TP.HCM"
                            />
                        </div>
                    </div>
                </div>
                <h2 className="repair-modal__title">Thông tin xe</h2>
                <div className="repair-modal__client-info">
                    <div className="repair-modal__input-item">
                        <label htmlFor="licensePlate">Biển số xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="licensePlate"
                                placeholder="51G-12345"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="carModel">Mẫu xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="carModel"
                                placeholder="Toyota Vios"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="chassisNumber">Số khung</label>
                        <div className="input-form ">
                            <input
                                className="w-100"
                                type="text"
                                id="chassisNumber"
                                placeholder="123456789012"
                            />
                        </div>
                    </div>
                </div>
                <div className="repair-modal__client-info">
                    <div className="repair-modal__input-item">
                        <label htmlFor="productionYear">Năm sản xuất</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="number"
                                id="productionYear"
                                placeholder="2024"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="brand">Hãng xe</label>
                        <div className="input-form ">
                            <input className="w-100" type="text" id="brand" placeholder="Toyota" />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="engineNumber">Số máy</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="engineNumber"
                                placeholder="123456789012"
                            />
                        </div>
                    </div>
                </div>
                <div className="repair-modal__client-info">
                    <div className="repair-modal__input-item">
                        <label htmlFor="cccdOwner">CCCD chủ xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="number"
                                id="cccdOwner"
                                placeholder="123456789012"
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item">
                        <label htmlFor="ownerName">Tên chủ xe</label>
                        <div className="input-form ">
                            <input
                                className="w-100"
                                type="text"
                                id="ownerName"
                                placeholder="Trần Văn A"
                            />
                        </div>
                    </div>
                </div>
                <div className="repair-modal__button-container">
                    <button className="repair-modal__button cancel-button" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="repair-modal__button confirm-button">Xác nhận</button>
                </div>
            </div>
        </>
    )
}
