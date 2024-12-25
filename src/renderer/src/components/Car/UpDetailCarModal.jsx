import { useState, useEffect } from 'react'
import { debounce } from 'lodash'
import { dbService } from '../../services/DatabaseService'
import Dropdown from '../Dropdown'
import AddNewCustomer from './AddNewCustomer'
import Modal from '../Modal'

export default function UpDetailCarModal({ onClose, data, type }) {
    const [carDetail, setCarDetail] = useState(data)
    const [customerName, setCustomerName] = useState(data?.customer?.name || '')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenAddNewCustomer, setIsOpenAddNewCustomer] = useState(false)
    const searchCustomers = debounce(async (searchText) => {
        if (!searchText) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        try {
            const customersByName = await dbService.findBy('customers', [
                {
                    field: 'name',
                    operator: '>=',
                    value: searchText
                },
                {
                    field: 'name',
                    operator: '<=',
                    value: searchText + '\uf8ff'
                }
            ])
            // Tìm theo CMND/CCCD
            const customersByIdentifyCard = await dbService.findBy('customers', [
                {
                    field: 'indentifyCard',
                    operator: '>=',
                    value: searchText
                },
                {
                    field: 'indentifyCard',
                    operator: '<=',
                    value: searchText + '\uf8ff'
                }
            ])
            // Gộp kết quả và loại bỏ trùng lặp
            const allCustomers = [...customersByName, ...customersByIdentifyCard]
            const uniqueCustomers = allCustomers.filter(
                (customer, index, self) => index === self.findIndex((c) => c.id === customer.id)
            )
            setSearchResults(uniqueCustomers)
        } catch (error) {
            console.error('Lỗi khi tìm khách hàng:', error)
        } finally {
            setIsSearching(false)
        }
    }, 300)

    const onSave = async () => {
        try {
            setIsLoading(true)
            const newData = {
                licensePlate: carDetail.licensePlate,
                brand: carDetail.brand,
                model: carDetail.model,
                engine: carDetail.engine,
                chassis: carDetail.chassis,
                manufacturingYear: carDetail.manufacturingYear,
                customerId: carDetail.customerId
            }
            await dbService.updateFields('cars', carDetail.id, newData)
            onClose()
        } catch (e) {
            alert(`có lỗi xảy ra: ${e.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const onAddNewCustomer = async (customer) => {
        if (customer) {
            data = { ...customer, birthday: new Date(customer.birthday).toISOString() }
            const newCustomer = await dbService.add('customers', data)
            setCarDetail({ ...carDetail, customer: newCustomer, customerId: newCustomer.id })
            setCustomerName(newCustomer.name)
        }
    }

    useEffect(() => {
        if (data) {
            setCarDetail(data)
            setCustomerName(data?.customer?.name || '')
        }
    }, [data])
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
                    <div className={`col-${type === 'detail' ? '12' : '9'}`}>
                        <label className="label-for-input">Chủ xe</label>
                        <Dropdown
                            value={customerName}
                            items={searchResults}
                            loading={isSearching}
                            onChange={(e) => {
                                const value = e.target.value
                                setCustomerName(value)
                                searchCustomers(value)
                            }}
                            onSelect={(customer) => {
                                // setSelectedCustomer(customer)
                                setCustomerName(customer.name)
                                setCarDetail({ ...carDetail, customer: customer })
                            }}
                            renderItem={(customer) => (
                                <div>
                                    <div>{customer.name + ' - ' + customer.indentifyCard}</div>
                                </div>
                            )}
                            placeholder="Nhập tên chủ xe..."
                            disabled={type === 'detail'}
                        />
                    </div>
                    {type !== 'detail' && (
                        <div className="col-3">
                            <div className="d-flex align-items-end h-100">
                                <button
                                    className="primary-button"
                                    onClick={() => setIsOpenAddNewCustomer(true)}
                                >
                                    Thêm mới
                                </button>
                            </div>
                        </div>
                    )}
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
                                value={carDetail?.manufacturingYear || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({
                                        ...carDetail,
                                        manufacturingYear: e.target.value
                                    })
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
                                value={carDetail?.chassis || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, chassis: e.target.value })
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
                                value={carDetail?.engine || ''}
                                disabled={type === 'detail'}
                                onChange={(e) =>
                                    setCarDetail({ ...carDetail, engine: e.target.value })
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
                        <button className="primary-button" onClick={onSave} disabled={isLoading}>
                            Lưu
                        </button>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isOpenAddNewCustomer}
                onClose={() => setIsOpenAddNewCustomer(false)}
                showHeader={false}
                width="600px"
            >
                <AddNewCustomer
                    onClose={() => setIsOpenAddNewCustomer(false)}
                    onSave={onAddNewCustomer}
                />
            </Modal>
        </>
    )
}
