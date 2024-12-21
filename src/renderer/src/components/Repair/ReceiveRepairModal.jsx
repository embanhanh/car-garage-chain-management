import { useState, useEffect } from 'react'
import DetailRepairModal from './DetailRepairModal'
import { dbService } from '../../services/DatabaseService'

export default function ReceiveRepairModal({ onClose }) {
    const [serviceRegisterData, setServiceRegisterData] = useState({
        car: {
            licensePlate: '',
            brand: '',
            model: '',
            engine: '',
            chassis: '',
            manufacturingYear: '',
            customer: {
                name: '',
                phone: '',
                email: '',
                address: '',
                indentifyCard: '',
                birthday: new Date()
            }
        },
        employeeId: JSON.parse(localStorage.getItem('currentUser'))?.employeeId,
        status: 'Đang sửa chữa',
        expectedCompletionDate: new Date(),
        repairRegisters: []
    })
    const [showDetailService, setShowDetailService] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const createServiceRegister = async () => {
        try {
            setIsLoading(true)
            const data = {
                employeeId: serviceRegisterData.employeeId,
                carId: serviceRegisterData.car.id || null,
                status: serviceRegisterData.status,
                expectedCompletionDate: serviceRegisterData.expectedCompletionDate,
                repairRegisterIds: []
            }

            if (serviceRegisterData.repairRegisters.length > 0) {
            }

            const customers = await dbService.findBy('customers', [
                {
                    field: 'indentifyCard',
                    operator: '==',
                    value: serviceRegisterData.car.customer.indentifyCard
                }
            ])

            let customerId = serviceRegisterData.car.customer.id || null
            if (!customers || customers.length === 0) {
                const customer = await dbService.add('customers', {
                    ...serviceRegisterData.car.customer
                })
                customerId = customer.id
            }

            const cars = await dbService.findBy('cars', [
                {
                    field: 'licensePlate',
                    operator: '==',
                    value: serviceRegisterData.car.licensePlate
                }
            ])

            if (!cars || cars.length === 0) {
                const carData = { ...serviceRegisterData.car }
                delete carData.customer
                console.log(customerId)
                const car = await dbService.add('cars', { ...carData, customerId: customerId })
                data.carId = car.id
            }

            await dbService.add('serviceregisters', data)
            onClose()
        } catch (error) {
            alert(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {showDetailService ? (
                <div className="">
                    <DetailRepairModal data={serviceRegisterData} />
                    <div className="page-btns center">
                        <button
                            className="repair-modal__button cancel-button"
                            onClick={() => {
                                setShowDetailService(false)
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            className="repair-modal__button confirm-button"
                            onClick={createServiceRegister}
                            disabled={isLoading}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-100 h-100 repair-modal">
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
                                        value={serviceRegisterData?.car?.licensePlate}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    licensePlate: e.target.value
                                                }
                                            }))
                                        }
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
                                        value={serviceRegisterData?.car?.model}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    model: e.target.value
                                                }
                                            }))
                                        }
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
                                        value={serviceRegisterData?.car?.chassis}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    chassis: e.target.value
                                                }
                                            }))
                                        }
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
                                        value={serviceRegisterData?.car?.manufacturingYear}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    manufacturingYear: e.target.value
                                                }
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="repair-modal__input-item">
                                <label htmlFor="brand">Hãng xe</label>
                                <div className="input-form ">
                                    <input
                                        className="w-100"
                                        type="text"
                                        id="brand"
                                        placeholder="Toyota"
                                        value={serviceRegisterData?.car?.brand}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    brand: e.target.value
                                                }
                                            }))
                                        }
                                    />
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
                                        value={serviceRegisterData?.car?.engine}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    engine: e.target.value
                                                }
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
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
                                        value={serviceRegisterData?.car?.customer?.phone}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    customer: {
                                                        ...pre.car.customer,
                                                        phone: e.target.value
                                                    }
                                                }
                                            }))
                                        }
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
                                        value={serviceRegisterData?.car?.customer?.name}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    customer: {
                                                        ...pre.car.customer,
                                                        name: e.target.value
                                                    }
                                                }
                                            }))
                                        }
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
                                        value={serviceRegisterData?.car?.customer?.email}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    customer: {
                                                        ...pre.car.customer,
                                                        email: e.target.value
                                                    }
                                                }
                                            }))
                                        }
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
                                        value={serviceRegisterData?.car?.customer?.birthday}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    customer: {
                                                        ...pre.car.customer,
                                                        birthday: e.target.value
                                                    }
                                                }
                                            }))
                                        }
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
                                        value={serviceRegisterData?.car?.customer?.indentifyCard}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    customer: {
                                                        ...pre.car.customer,
                                                        indentifyCard: e.target.value
                                                    }
                                                }
                                            }))
                                        }
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
                                        value={serviceRegisterData?.car?.customer?.address}
                                        onChange={(e) =>
                                            setServiceRegisterData((pre) => ({
                                                ...pre,
                                                car: {
                                                    ...pre.car,
                                                    customer: {
                                                        ...pre.car.customer,
                                                        address: e.target.value
                                                    }
                                                }
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="repair-modal__button-container mt-2">
                            <button
                                className="repair-modal__button cancel-button"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button
                                className="repair-modal__button confirm-button"
                                onClick={() => {
                                    setShowDetailService(true)
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
