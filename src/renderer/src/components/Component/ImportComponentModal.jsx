import { useState, useEffect } from 'react'
import { debounce } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import Modal from '../Modal'
import AddComponentModal from './AddComponentModal'
import Dropdown from '../Dropdown'
import ComboBox from '../Combobox'
import { dbService } from '../../services/DatabaseService'
import { increment } from 'firebase/firestore'
import { addInputComponentRegister } from '../../controllers/inputComponentRegisterController'

const ImportComponentModal = ({ onClose, data }) => {
    const [componentName, setComponentName] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedComponent, setSelectedComponent] = useState(null)
    const [quantity, setQuantity] = useState(0)
    const [price, setPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [inputComponentRegister, setInputComponentRegister] = useState(
        data
            ? data
            : {
                  employeeId: '',
                  details: [],
                  supplierId: ''
              }
    )
    const [openAddComponent, setOpenAddComponent] = useState(false)
    const [suppliers, setSuppliers] = useState([])

    useEffect(() => {
        const fetchSuppliers = async () => {
            const suppliers = await dbService.getAll('suppliers')
            setSuppliers(suppliers)
        }
        fetchSuppliers()
    }, [])

    const searchComponents = debounce(async (searchText) => {
        try {
            setIsSearching(true)
            let components = []
            if (!searchText) {
                components = await dbService.getAll('components')
            } else {
                components = await dbService.findBy('components', [
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
            }
            const filteredComponents = components.filter(
                (component) =>
                    !inputComponentRegister.details.some(
                        (item) => item.component.id === component.id
                    )
            )
            setSearchResults(filteredComponents)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSearching(false)
        }
    }, 300)

    const handleAddComponentRegister = async () => {
        setIsLoading(true)
        try {
            const componentRegister = {
                employeeId: JSON.parse(localStorage.getItem('currentUser'))?.employee?.id,
                details: inputComponentRegister.details.map((item) => ({
                    componentId: item.component.id,
                    quantity: Number(item.quantity),
                    inputPrice: Number(item.inputPrice)
                })),
                supplierId: inputComponentRegister.supplierId
            }
            // await dbService.add('inputcomponentregisters', componentRegister)
            await addInputComponentRegister(componentRegister)
            inputComponentRegister.details.forEach(async (item) => {
                const component = await dbService.getById('components', item.component.id)
                if (component) {
                    if (component.price !== Number(item.inputPrice)) {
                        await dbService.update('components', item.component.id, {
                            price: Number(item.inputPrice),
                            inventory: component.inventory + Number(item.quantity)
                        })
                    } else {
                        await dbService.update('components', item.component.id, {
                            inventory: component.inventory + Number(item.quantity)
                        })
                    }
                }
            })
            await Swal.fire({
                title: 'Thành công',
                text: 'Nhập phụ tùng thành công',
                icon: 'success',
                confirmButtonText: 'OK'
            })
            onClose()
        } catch (error) {
            await Swal.fire({
                title: 'Thất bại',
                text: 'Có lỗi xảy ra, vui lòng thử lại',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateComponentRegister = async () => {
        setIsLoading(true)
        try {
            const componentRegister = {
                employeeId: JSON.parse(localStorage.getItem('currentUser'))?.employee?.id,
                details: inputComponentRegister.details.map((item) => ({
                    componentId: item.component.id,
                    quantity: Number(item.quantity),
                    inputPrice: Number(item.inputPrice)
                })),
                supplierId: inputComponentRegister.supplierId
            }
            await dbService.update('inputcomponentregisters', data.id, componentRegister)

            data.details.forEach(async (item) => {
                const findComponent = componentRegister.details.find(
                    (res) => res.componentId == item.componentId
                )
                if (findComponent) {
                    if (
                        item.quantity !== findComponent.quantity &&
                        item.inputPrice !== findComponent.inputPrice
                    ) {
                        await dbService.update('components', item.componentId, {
                            price: Number(findComponent.inputPrice),
                            inventory: increment(Number(findComponent.quantity - item.quantity))
                        })
                    } else if (item.quantity !== findComponent.quantity) {
                        await dbService.update('components', item.componentId, {
                            inventory: increment(Number(findComponent.quantity - item.quantity))
                        })
                    } else if (item.inputPrice !== findComponent.inputPrice) {
                        await dbService.update('components', item.componentId, {
                            price: Number(findComponent.inputPrice)
                        })
                    }
                } else {
                    await dbService.update('components', item.componentId, {
                        inventory: increment(Number(item.quantity * -1))
                    })
                }
            })
            componentRegister.details.forEach(async (item) => {
                const findComponent = data.details.find(
                    (res) => res.componentId == item.componentId
                )
                if (!findComponent) {
                    const component = await dbService.getById('components', item.componentId)
                    if (component) {
                        if (component.price !== Number(item.inputPrice)) {
                            await dbService.update('components', item.componentId, {
                                price: Number(item.inputPrice),
                                inventory: component.inventory + Number(item.quantity)
                            })
                        } else {
                            await dbService.update('components', item.componentId, {
                                inventory: component.inventory + Number(item.quantity)
                            })
                        }
                    }
                }
            })
            await Swal.fire({
                title: 'Thành công',
                text: 'Cập nhật phiếu nhập thành công',
                icon: 'success',
                confirmButtonText: 'OK'
            })
            onClose()
        } catch (error) {
            await Swal.fire({
                title: 'Thất bại',
                text: 'Có lỗi xảy ra, vui lòng thử lại',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (selectedComponent) {
            console.log(selectedComponent)
        }
    }, [selectedComponent])

    return (
        <>
            <div className="component-used-modal">
                <div className="component-used-modal__add-component">
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="componentName">Tên phụ tùng</label>
                        <Dropdown
                            value={componentName}
                            items={searchResults}
                            loading={isSearching}
                            onChange={(e) => {
                                const value = e.target.value
                                setComponentName(value)
                                searchComponents(value)
                            }}
                            onSelect={(component) => {
                                setSelectedComponent(component)
                                setComponentName(component.name)
                            }}
                            renderItem={(component) => (
                                <div>
                                    <p>{component.name}</p>
                                </div>
                            )}
                            placeholder="Nhập tên phụ tùng..."
                        />
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="componentCode">Mã phụ tùng</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="componentCode"
                                placeholder="PCS001"
                                disabled
                                value={selectedComponent?.id || ''}
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="componentType">Loại phụ tùng</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                id="componentType"
                                placeholder="Phụ tùng động cơ"
                                disabled
                                value={selectedComponent?.category?.name || ''}
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="quantity">Số lượng</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="number"
                                id="quantity"
                                placeholder="1"
                                value={quantity}
                                onChange={(e) => {
                                    setQuantity(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className="repair-modal__input-item mb-3">
                        <label htmlFor="price">Đơn giá nhập</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="number"
                                id="price"
                                placeholder="100000"
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className="staff-in-charge__actions">
                        <button className="repair-modal__button cancel-button" onClick={onClose}>
                            Hủy
                        </button>
                        <button
                            className="repair-modal__button confirm-button"
                            onClick={() => {
                                if (!selectedComponent || !quantity || !price) return
                                setInputComponentRegister({
                                    ...inputComponentRegister,
                                    details: [
                                        ...inputComponentRegister.details,
                                        {
                                            component: selectedComponent,
                                            quantity,
                                            inputPrice: price
                                        }
                                    ]
                                })
                                setSelectedComponent(null)
                                setQuantity(0)
                                setPrice(0)
                                setComponentName('')
                                setSearchResults([])
                            }}
                        >
                            Thêm
                        </button>
                    </div>
                </div>
                <div className="repair-modal__separate mr-3 ml-3"></div>
                <div className="repair-modal__table-container">
                    <div className="d-flex gap-2">
                        <div style={{ width: '400px' }}>
                            <ComboBox
                                placeholder="Chọn nhà cung cấp"
                                value={inputComponentRegister.supplierId}
                                onChange={(value) => {
                                    setInputComponentRegister((pre) => ({
                                        ...pre,
                                        supplierId: value
                                    }))
                                }}
                                options={suppliers.map((sup) => ({
                                    value: sup.id,
                                    label: sup.name
                                }))}
                            ></ComboBox>
                        </div>

                        <button
                            className="primary-button"
                            onClick={() => setOpenAddComponent(true)}
                        >
                            Thêm phụ tùng mới
                        </button>
                    </div>
                    <h3 className="repair-modal__table-title">Danh sách phụ tùng đã nhập</h3>
                    <div className="repair-modal__table-content">
                        <table className="page-table component-used-table table-scrollable">
                            <thead>
                                <tr>
                                    <th>Mã phụ tùng</th>
                                    <th>Tên phụ tùng</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá nhập</th>
                                    <th>Thành tiền</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inputComponentRegister?.details?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.component.id}</td>
                                        <td>{item.component.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{Number(item.inputPrice).toLocaleString('vi-VN')}</td>
                                        <td>
                                            {(item.quantity * item.inputPrice).toLocaleString(
                                                'vi-VN'
                                            )}
                                        </td>
                                        <td>
                                            <div className="table__actions">
                                                <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                    className="table__action-icon"
                                                />
                                                <div className={`table__action-menu`}>
                                                    <div
                                                        className="table__action-item"
                                                        onClick={() => {
                                                            setInputComponentRegister({
                                                                ...inputComponentRegister,
                                                                details:
                                                                    inputComponentRegister.details.filter(
                                                                        (component) =>
                                                                            component.component
                                                                                .id !==
                                                                            item.component.id
                                                                    )
                                                            })
                                                        }}
                                                    >
                                                        Xóa
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="repair-modal__btn-container">
                        <button
                            className="primary-button mt-3"
                            onClick={() => {
                                if (data) {
                                    handleUpdateComponentRegister()
                                } else {
                                    handleAddComponentRegister()
                                }
                            }}
                            disabled={
                                isLoading ||
                                inputComponentRegister.details.length == 0 ||
                                !inputComponentRegister.supplierId
                            }
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openAddComponent}
                onClose={() => setOpenAddComponent(false)}
                width="700px"
                showHeader={true}
                title="Thêm phụ tùng mới"
            >
                <AddComponentModal onClose={() => setOpenAddComponent(false)}></AddComponentModal>
            </Modal>
        </>
    )
}

export default ImportComponentModal
