import { useState, useEffect } from 'react'
import DetailRepairModal from './DetailRepairModal'
import Dropdown from '../Dropdown'
import { debounce } from 'lodash'
import { dbService } from '../../services/DatabaseService'
import { format } from 'date-fns'

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
                identifyCard: '',
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
    const [errorMessage, setErrorMessage] = useState('')
    const [searchResults, setSearchResults] = useState({
        cars: [],
        customers: []
    })
    const [isSearching, setIsSearching] = useState({
        cars: false,
        customers: false
    })

    const searchCars = debounce(async (searchText) => {
        if (!searchText) {
            setSearchResults((prev) => ({ ...prev, cars: [] }))
            return
        }

        setIsSearching((prev) => ({ ...prev, cars: true }))
        try {
            const cars = await dbService.findBy('cars', [
                {
                    field: 'licensePlate',
                    operator: '>=',
                    value: searchText.toUpperCase()
                },
                {
                    field: 'licensePlate',
                    operator: '<=',
                    value: searchText.toUpperCase() + '\uf8ff'
                }
            ])
            setSearchResults((prev) => ({ ...prev, cars }))
        } catch (error) {
            console.error('Lỗi khi tìm xe:', error)
        } finally {
            setIsSearching((prev) => ({ ...prev, cars: false }))
        }
    }, 300)

    const searchCustomers = debounce(async (searchText) => {
        if (!searchText) {
            setSearchResults((prev) => ({ ...prev, customers: [] }))
            return
        }
        setIsSearching((prev) => ({ ...prev, customers: true }))
        try {
            const customers = await dbService.findBy('customers', [
                {
                    field: 'identifyCard',
                    operator: '>=',
                    value: searchText
                },
                {
                    field: 'identifyCard',
                    operator: '<=',
                    value: searchText + '\uf8ff'
                }
            ])
            setSearchResults((prev) => ({ ...prev, customers }))
        } catch (error) {
            console.error('Lỗi khi tìm khách hàng:', error)
        } finally {
            setIsSearching((prev) => ({ ...prev, customers: false }))
        }
    }, 300)

    const createServiceRegister = async () => {
        try {
            setIsLoading(true)
            const data = {
                employeeId: serviceRegisterData.employeeId,
                carId: serviceRegisterData.car.id || null,
                status: serviceRegisterData.status,
                expectedCompletionDate: new Date(
                    serviceRegisterData.expectedCompletionDate
                ).toISOString(),
                repairRegisterIds: []
            }

            if (serviceRegisterData.repairRegisters.length > 0) {
                serviceRegisterData.repairRegisters.map(async (item) => {
                    const newData = await dbService.add('repairregisters', {
                        status: 'Đang sửa chữa',
                        serviceId: item.service?.id,
                        employeeIds: item.employees?.map((emp) => emp.id),
                        repairRegisterComponents: item.repairRegisterComponents.map((comp) => ({
                            componentId: comp.component.id,
                            quantity: comp.quantity
                        }))
                    })
                    data.repairRegisterIds.push(newData.id)
                })
            }

            const customers = await dbService.findBy('customers', [
                {
                    field: 'identifyCard',
                    operator: '==',
                    value: serviceRegisterData.car.customer.identifyCard
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

    const validateCarCustomerInfo = () => {
        return (
            serviceRegisterData.car.customer.name &&
            serviceRegisterData.car.customer.phone &&
            serviceRegisterData.car.customer.email &&
            serviceRegisterData.car.customer.address &&
            serviceRegisterData.car.customer.identifyCard &&
            serviceRegisterData.car.customer.birthday &&
            serviceRegisterData.car.licensePlate &&
            serviceRegisterData.car.model &&
            serviceRegisterData.car.chassis &&
            serviceRegisterData.car.manufacturingYear &&
            serviceRegisterData.car.brand &&
            serviceRegisterData.car.engine
        )
    }

    const onAddService = (service) => {
        if (!serviceRegisterData.repairRegisters.find((item) => item.service.id === service.id)) {
            setServiceRegisterData((pre) => ({
                ...pre,
                repairRegisters: [
                    ...pre.repairRegisters,
                    {
                        service,
                        status: 'Đang sửa chữa',
                        employees: [],
                        repairRegisterComponents: []
                    }
                ]
            }))
        }
    }

    const onDeleteService = (serviceId) => {
        if (serviceId) {
            setServiceRegisterData((pre) => ({
                ...pre,
                repairRegisters: pre.repairRegisters.filter((item) => item.service.id !== serviceId)
            }))
        }
    }

    const onCompleteService = async (serviceId) => {
        if (serviceId) {
            setServiceRegisterData((pre) => {
                const newData = { ...pre }
                const foundRegister = newData.repairRegisters?.find(
                    (item) => item.service.id === serviceId
                )
                if (foundRegister) {
                    foundRegister.status = 'Đã hoàn thành'
                }
                return newData
            })
        }
    }

    const onAddStaffInCharge = (staffs, serviceId) => {
        if (staffs && serviceId) {
            setServiceRegisterData((pre) => {
                const newData = { ...pre }
                const foundRegister = newData.repairRegisters?.find(
                    (item) => item.service.id === serviceId
                )
                if (foundRegister?.employees) {
                    foundRegister.employees = [...staffs]
                }
                return newData
            })
        }
    }

    const onAddComponentUsed = (components, serviceId) => {
        if (components && serviceId) {
            setServiceRegisterData((pre) => {
                const newData = { ...pre }
                const foundRegister = newData.repairRegisters?.find(
                    (item) => item.service.id === serviceId
                )
                if (foundRegister?.repairRegisterComponents) {
                    foundRegister.repairRegisterComponents = [...components]
                }
                return newData
            })
        }
    }

    useEffect(() => {
        if (errorMessage) {
            setErrorMessage('')
        }
    }, [serviceRegisterData])

    useEffect(() => {
        if (serviceRegisterData.repairRegisters.length > 0) {
            const totalHours = serviceRegisterData.repairRegisters.reduce(
                (sum, item) => sum + item.service.duration,
                0
            )
            const totalDays = totalHours / 24 // Chuyển giờ thành ngày

            const currentDate = new Date()
            currentDate.setDate(currentDate.getDate() + totalDays)
            setServiceRegisterData((pre) => ({
                ...pre,
                expectedCompletionDate: currentDate
            }))
        }
    }, [serviceRegisterData.repairRegisters])

    return (
        <>
            {showDetailService ? (
                <div className="">
                    <DetailRepairModal
                        data={serviceRegisterData}
                        onAddService={onAddService}
                        onDeleteService={onDeleteService}
                        onAddStaffInCharge={onAddStaffInCharge}
                        onAddComponentUsed={onAddComponentUsed}
                        onCompleteService={onCompleteService}
                        type="add"
                    />
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
                                <label>Biển số xe</label>
                                <Dropdown
                                    value={serviceRegisterData.car.licensePlate}
                                    items={searchResults.cars}
                                    loading={isSearching.cars}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setServiceRegisterData((pre) => ({
                                            ...pre,
                                            car: {
                                                ...pre.car,
                                                licensePlate: value
                                            }
                                        }))
                                        searchCars(value)
                                    }}
                                    onSelect={(car) => {
                                        setServiceRegisterData((pre) => ({
                                            ...pre,
                                            car: {
                                                ...car,
                                                customer: car.customer || pre.car.customer
                                            }
                                        }))
                                    }}
                                    renderItem={(car) => (
                                        <div>
                                            <p>{car.licensePlate}</p>
                                        </div>
                                    )}
                                    placeholder="51G-12345"
                                />
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
                                <label htmlFor="cccd">CCCD</label>
                                <Dropdown
                                    value={serviceRegisterData.car.customer.identifyCard}
                                    items={searchResults.customers}
                                    loading={isSearching.customers}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        setServiceRegisterData((pre) => ({
                                            ...pre,
                                            car: {
                                                ...pre.car,
                                                customer: {
                                                    ...pre.car.customer,
                                                    identifyCard: value
                                                }
                                            }
                                        }))
                                        searchCustomers(value)
                                    }}
                                    onSelect={(customer) => {
                                        setServiceRegisterData((pre) => ({
                                            ...pre,
                                            car: {
                                                ...pre.car,
                                                customer: customer
                                            }
                                        }))
                                    }}
                                    renderItem={(customer) => (
                                        <div>
                                            <div>{customer.identifyCard}</div>
                                            <div
                                                className="text-muted"
                                                style={{ fontSize: '1.2rem' }}
                                            >
                                                {customer.name}
                                            </div>
                                        </div>
                                    )}
                                    placeholder="123456789012"
                                />
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
                                        value={format(
                                            new Date(serviceRegisterData?.car?.customer?.birthday),
                                            'yyyy-MM-dd'
                                        )}
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
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button
                                className="repair-modal__button cancel-button"
                                onClick={onClose}
                            >
                                Hủy
                            </button>
                            <button
                                className="repair-modal__button confirm-button"
                                onClick={() => {
                                    if (validateCarCustomerInfo()) {
                                        setShowDetailService(true)
                                    } else {
                                        setErrorMessage(
                                            'Vui lòng nhập đầy đủ thông tin xe và khách hàng'
                                        )
                                    }
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
