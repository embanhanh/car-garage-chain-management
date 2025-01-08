import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash'
import { dbService } from '../../services/DatabaseService'
import Dropdown from '../Dropdown'

const StaffInChargeModal = ({ onClose, data, onAddStaffInCharge }) => {
    const [staffInChargeData, setStaffInChargeData] = useState(data?.employees || [])
    const [staffName, setStaffName] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setStaffInChargeData(data?.employees)
    }, [data])

    const searchStaffs = debounce(async (searchText) => {
        if (!searchText) {
            setSearchResults([])
            return
        }
        setIsSearching(true)
        try {
            const staffs = await dbService.findBy('employees', [
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
            const filteredStaffs = staffs.filter(
                (staff) =>
                    !staffInChargeData.some((emp) => emp.id === staff.id) &&
                    staff.garageId === JSON.parse(localStorage.getItem('currentGarage')).id &&
                    staff.position == 'Kỹ thuật'
            )
            setSearchResults(filteredStaffs)
        } catch (error) {
            console.error('Lỗi khi tìm nhân viên:', error)
        } finally {
            setIsSearching(false)
        }
    }, 300)
    return (
        <div className="staff-in-charge-modal">
            <div className="staff-in-charge-modal__add-staff">
                <div className="repair-modal__input-item mb-3">
                    <label htmlFor="staffName">Tên nhân viên</label>
                    <Dropdown
                        value={staffName}
                        items={searchResults}
                        loading={isSearching}
                        onChange={(e) => {
                            const value = e.target.value
                            setStaffName(value)
                            searchStaffs(value)
                        }}
                        onSelect={(staff) => {
                            setSelectedStaff(staff)
                            setStaffName(staff.name)
                        }}
                        renderItem={(staff) => (
                            <div>
                                <p>{staff.name}</p>
                            </div>
                        )}
                        placeholder="Nhập tên nhân viên..."
                    />
                </div>
                <div className="repair-modal__input-item mb-3">
                    <label htmlFor="staffCode">Mã nhân viên</label>
                    <div className="input-form">
                        <input
                            className="w-100"
                            type="text"
                            id="staffCode"
                            placeholder="NV008"
                            value={selectedStaff?.id || ''}
                            disabled
                        />
                    </div>
                </div>
                <div className="repair-modal__input-item mb-3">
                    <label htmlFor="staffPhone">Số điện thoại</label>
                    <div className="input-form">
                        <input
                            className="w-100"
                            type="text"
                            id="staffPhone"
                            placeholder="0909090909"
                            disabled
                            value={selectedStaff?.phone || ''}
                        />
                    </div>
                </div>
                <div className="staff-in-charge__actions">
                    <button className="repair-modal__button cancel-button" onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        className="primary-button"
                        disabled={data?.status == 'Đã hoàn thành'}
                        onClick={() => {
                            if (selectedStaff !== null) {
                                setStaffInChargeData((pre) => [...pre, selectedStaff])
                                setSelectedStaff(null)
                                setStaffName('')
                            }
                        }}
                    >
                        Thêm
                    </button>
                </div>
            </div>
            <div className="repair-modal__separate mr-3 ml-3"></div>
            <div className="repair-modal__table-container">
                <h3 className="repair-modal__table-title">Danh sách nhân viên phụ trách</h3>
                <div className="repair-modal__table-content">
                    <table className="page-table staff-in-charge-table table-scrollable">
                        <thead>
                            <tr>
                                <th>Thứ tự</th>
                                <th>Tên nhân viên</th>
                                <th>Số điện thoại</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffInChargeData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.phone}</td>
                                    <td>
                                        <div className="table__actions">
                                            <FontAwesomeIcon
                                                icon={faEllipsisVertical}
                                                className="table__action-icon"
                                            />
                                            {data?.status != 'Đã hoàn thành' && (
                                                <div className={`table__action-menu`}>
                                                    <div
                                                        className="table__action-item"
                                                        onClick={() => {
                                                            setStaffInChargeData((pre) =>
                                                                pre?.filter(
                                                                    (emp) => emp.id !== item.id
                                                                )
                                                            )
                                                        }}
                                                    >
                                                        Xóa
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="page-btns end">
                    <button
                        className="primary-button mt-3"
                        onClick={async () => {
                            if (staffInChargeData) {
                                try {
                                    setIsLoading(true)
                                    await onAddStaffInCharge(staffInChargeData, data?.service?.id)
                                } catch (error) {
                                    alert(error.message)
                                } finally {
                                    setIsLoading(false)
                                }
                                onClose()
                            }
                        }}
                        disabled={isLoading || data?.status == 'Đã hoàn thành'}
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StaffInChargeModal
