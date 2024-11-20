function UpdateComponent({ onClose }) {
    return (
        <div className="update-component-modal">
            <div className="row">
                <div className="repair-modal__input-item col-6">
                    <label htmlFor="componentCode">Mã phụ tùng</label>
                    <div className="input-form">
                        <input
                            className="w-100"
                            type="text"
                            id="componentCode"
                            placeholder="PCS001"
                        />
                    </div>
                </div>
                <div className="repair-modal__input-item col-6">
                    <label htmlFor="componentName">Tên phụ tùng</label>
                    <div className="input-form">
                        <input
                            className="w-100"
                            type="text"
                            id="componentName"
                            placeholder="Bộ lọc nước"
                        />
                    </div>
                </div>
                <div className="repair-modal__input-item col-6">
                    <label htmlFor="componentType">Loại phụ tùng</label>
                    <div className="input-form">
                        <input
                            className="w-100"
                            type="text"
                            id="componentType"
                            placeholder="Phụ tùng"
                        />
                    </div>
                </div>
                <div className="repair-modal__input-item col-6">
                    <label htmlFor="componentQuantity">Số lượng</label>
                    <div className="input-form">
                        <input
                            className="w-100"
                            type="number"
                            id="componentQuantity"
                            placeholder="1"
                        />
                    </div>
                </div>
            </div>
            <div className="repair-modal__btn-container mt-3">
                <button className="repair-modal__button cancel-button" onClick={onClose}>
                    Hủy
                </button>
                <button className="repair-modal__button confirm-button ml-3">Xác nhận</button>
            </div>
        </div>
    )
}

export default UpdateComponent
