import logo from '../../assets/images/logo/logo.png'

function DetailInvoiceModal({ onClose }) {
    return (
        <div className="detail-invoice-modal">
            <div className="detail-invoice-modal__info">
                <div className="detail-invoice-modal__info-img">
                    <img src={logo} alt="logo" />
                </div>
                <div className="detail-invoice-modal__info-content">
                    <h3 className="detail-invoice-modal__label">
                        Địa chỉ: Bcons Sala, Dĩ An, Bình Dương
                    </h3>
                    <h3 className="detail-invoice-modal__label">Hotline: 0914259475</h3>
                    <h3 className="detail-invoice-modal__label">Website: https://www.carage.com</h3>
                </div>
            </div>
            <h2 className="detail-invoice-modal__title">HÓA ĐƠN THANH TOÁN</h2>
            <div className="row">
                <div className="col-6">
                    <h3 className="detail-invoice-modal__label">Mã hóa đơn: HP001</h3>
                </div>

                <div className="col-6">
                    <h3 className="detail-invoice-modal__label">Nhân viên: Trần Trung Thông</h3>
                </div>
                <div className="col-6">
                    <h3 className="detail-invoice-modal__label">Ngày tiếp nhận: 21/04/2021</h3>
                </div>
                <div className="col-6">
                    <h3 className="detail-invoice-modal__label">Ngày thanh toán: 22/04/2024</h3>
                </div>
            </div>
            <div className="detail-invoice-modal__table">
                <table className="page-table">
                    <thead>
                        <tr>
                            <th>Thứ tự</th>
                            <th>Tên dịch vụ sử dụng</th>
                            <th>Đơn giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Thay bộ lọc động cơ</td>
                            <td>đ 180.000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="detail-invoice-modal__separate"></div>
            <div className="detail-invoice-modal__total">
                <h3 className="detail-invoice-modal__label">Tổng tiền</h3>
                <h3 className="detail-invoice-modal__label">đ 180.000</h3>
            </div>
            <div className="page-btns end">
                <button className="page__header-button">Đóng</button>
                <button className="primary-button shadow-none">Thanh toán</button>
            </div>
        </div>
    )
}

export default DetailInvoiceModal
