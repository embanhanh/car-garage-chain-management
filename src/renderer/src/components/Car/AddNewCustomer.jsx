import { useState } from 'react'

export default function AddNewCustomer({ onClose, onSave }) {
    const [isLoading, setIsLoading] = useState(false)
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        identifyCard: '',
        birthday: new Date()
    })
    const [error, setError] = useState('')

    const validateCustomer = () => {
        return (
            customer.name &&
            customer.phone &&
            customer.identifyCard &&
            customer.birthday &&
            customer.email &&
            customer.address
        )
    }

    return (
        <>
            <div className="car-detail__modal d-flex flex-column gap-3 p-2">
                <div className="row">
                    <div className="col-6">
                        <label className="label-for-input">Họ tên</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập họ tên"
                                value={customer.name}
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Số điện thoại</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập số điện thoại"
                                value={customer.phone}
                                onChange={(e) =>
                                    setCustomer({ ...customer, phone: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">CCCD</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập CCCD"
                                value={customer.identifyCard}
                                onChange={(e) =>
                                    setCustomer({ ...customer, identifyCard: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Ngày sinh</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="date"
                                value={customer.birthday}
                                onChange={(e) =>
                                    setCustomer({ ...customer, birthday: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Email</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập email"
                                value={customer.email}
                                onChange={(e) =>
                                    setCustomer({ ...customer, email: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Địa chỉ</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                placeholder="Nhập địa chỉ"
                                value={customer.address}
                                onChange={(e) =>
                                    setCustomer({ ...customer, address: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className={`page-btns end`}>
                    {error && (
                        <div className="error-message d-flex align-items-center">{error}</div>
                    )}
                    <button className="page__header-button" onClick={() => onClose()}>
                        Huỷ
                    </button>
                    <button
                        className="primary-button"
                        onClick={async () => {
                            try {
                                setIsLoading(true)
                                if (validateCustomer()) {
                                    await onSave(customer)
                                    onClose()
                                } else {
                                    setError('Vui lòng điền đầy đủ các trường')
                                }
                            } catch (error) {
                                console.log(error)
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                        disabled={isLoading}
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </>
    )
}
