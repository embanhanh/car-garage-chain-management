import { useState } from 'react'

export default function UpDetailCarModal({ onClose, data, onSave, type }) {
    const [carDetail, setCarDetail] = useState(data)
    return (
        <>
            <div className="car-detail__modal d-flex flex-column gap-3 p-2">
                <div className="row">
                    <div className="col-6">
                        <label className="label-for-input">Biển số xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={carDetail?.licensePlate || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, licensePlate: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Mẫu xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={carDetail?.model || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, model: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Hãng xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={carDetail?.brand || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, brand: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Năm sản xuất</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={carDetail?.year || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, year: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Tên chủ xe</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={carDetail?.owner || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, owner: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Trạng thái</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={carDetail?.status || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, status: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Số khung</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={carDetail?.chassisNumber || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, chassisNumber: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-6">
                        <label className="label-for-input">Số máy</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={carDetail?.engineNumber || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, engineNumber: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className={`page-btns ${type === 'detail' ? 'center' : 'end'}`}>
                    <button className="page__header-button" onClick={() => onClose()}>
                        {type == 'detail' ? 'Đóng' : 'Hủy'}
                    </button>
                    {type !== 'detail' && (
                        <button className="primary-button" onClick={() => onSave()}>
                            Lưu
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}
