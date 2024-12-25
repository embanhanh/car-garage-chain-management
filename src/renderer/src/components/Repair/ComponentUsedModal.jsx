import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash'
import UpdateComponent from './UpdateComponent'
import Modal from '../Modal'
import { dbService } from '../../services/DatabaseService'
import Dropdown from '../Dropdown'

const ComponentUsedModal = ({ onClose, data, onAddComponentUsed }) => {
    const [openUpdateComponentModal, setOpenUpdateComponentModal] = useState({
        show: false,
        data: null
    })
    const [componentUsedData, setComponentUsedData] = useState(data?.repairRegisterComponents || [])
    const [componentName, setComponentName] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedComponent, setSelectedComponent] = useState(null)
    const [quantity, setQuantity] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setComponentUsedData(data?.repairRegisterComponents)
    }, [data])

    const searchComponents = debounce(async (searchText) => {
        if (!searchText) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        try {
            const components = await dbService.findBy('components', [
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
            // Lọc ra những nhân viên chưa được phân công
            const filteredComponents = components.filter(
                (component) => !componentUsedData.some((item) => item.component.id === component.id)
            )
            setSearchResults(filteredComponents)
        } catch (error) {
            console.error('Lỗi khi tìm phụ tùng:', error)
        } finally {
            setIsSearching(false)
        }
    }, 300)

    const handleConfirmUpdateComponent = (quantity) => {
        if (openUpdateComponentModal.data) {
            setComponentUsedData((pre) => {
                const index = pre.findIndex(
                    (item) => item.component.id === openUpdateComponentModal.data.component.id
                )
                pre[index].quantity = quantity
                return pre
            })
            setOpenUpdateComponentModal({
                show: false,
                data: null
            })
        }
    }

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
                                value={selectedComponent?.serviceType?.name || ''}
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
                                    setQuantity(Number(e.target.value))
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
                            onClick={async () => {
                                if (selectedComponent !== null && quantity > 0) {
                                    setComponentUsedData((pre) => [
                                        ...pre,
                                        {
                                            component: selectedComponent,
                                            quantity: quantity
                                        }
                                    ])
                                    setComponentName('')
                                    setSelectedComponent(null)
                                    setQuantity(0)
                                }
                            }}
                        >
                            Thêm
                        </button>
                    </div>
                </div>
                <div className="repair-modal__separate mr-3 ml-3"></div>
                <div className="repair-modal__table-container">
                    <h3 className="repair-modal__table-title">Danh sách phụ tùng sử dụng</h3>
                    <div className="repair-modal__table-content">
                        <table className="page-table component-used-table table-scrollable">
                            <thead>
                                <tr>
                                    <th>Mã phụ tùng</th>
                                    <th>Tên phụ tùng</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {componentUsedData?.map((item, index) => (
                                    <tr key={item.component.id}>
                                        <td>{item.component.id}</td>
                                        <td>{item.component.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.component.price}</td>
                                        <td>{item.quantity * item.component.price}</td>
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
                                                            setOpenUpdateComponentModal({
                                                                show: true,
                                                                data: item
                                                            })
                                                        }}
                                                    >
                                                        Cập nhật
                                                    </div>
                                                    <div
                                                        className="table__action-item"
                                                        onClick={() => {
                                                            setComponentUsedData((pre) =>
                                                                pre?.filter(
                                                                    (comp) =>
                                                                        comp.component.id !==
                                                                        item.component.id
                                                                )
                                                            )
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
                            className="repair-modal__button confirm-button"
                            onClick={async () => {
                                if (componentUsedData) {
                                    try {
                                        setIsLoading(true)
                                        await onAddComponentUsed(
                                            componentUsedData,
                                            data?.service?.id
                                        )
                                    } catch (error) {
                                        alert(error.message)
                                    } finally {
                                        setIsLoading(false)
                                    }
                                    onClose()
                                }
                            }}
                            disabled={isLoading}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openUpdateComponentModal.show}
                onClose={() =>
                    setOpenUpdateComponentModal({
                        show: false,
                        data: null
                    })
                }
                showHeader={false}
                width="500px"
            >
                <UpdateComponent
                    onClose={() =>
                        setOpenUpdateComponentModal({
                            show: false,
                            data: null
                        })
                    }
                    data={openUpdateComponentModal.data}
                    onConfirm={handleConfirmUpdateComponent}
                />
            </Modal>
        </>
    )
}

export default ComponentUsedModal
