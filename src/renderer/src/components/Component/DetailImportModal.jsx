function DetailImportModal({ data, onClose }) {
    return (
        <>
            <div className="d-flex flex-column gap-3">
                <div className="row">
                    <div className="col-4">
                        <label className="label-for-input" htmlFor="">
                            Mã phiếu nhập
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                disabled
                                placeholder="Nguyen Van A"
                                value={data?.id}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <label className="label-for-input" htmlFor="">
                            Nhân viên nhập
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                disabled
                                placeholder="Nguyen Van A"
                                value={data?.employee?.name}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <label className="label-for-input" htmlFor="">
                            Nhà cung cấp
                        </label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                disabled
                                placeholder="Nguyen Van A"
                                value={data?.supplier?.name}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-100" style={{ maxHeight: '350px' }}>
                    <table className="page-table table-scrollable">
                        <thead>
                            <tr>
                                <th>Mã phụ tùng</th>
                                <th>Tên phụ tùng</th>
                                <th>Loại phụ tùng</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.details?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.component?.id}</td>
                                    <td>{item.component?.name}</td>
                                    <td>{item.component?.category?.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.inputPrice}</td>
                                    <td>{item.quantity * item.inputPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="page-btns center">
                    <button className="page__header-button" onClick={() => onClose()}>
                        Đóng
                    </button>
                </div>
            </div>
        </>
    )
}

export default DetailImportModal
