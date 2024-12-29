import TextFieldForm from '../../components/text_field'
import './add_employee.css'
import { useState } from 'react'
import ComboBox from '../../components/Combobox.jsx'
import { dbService } from '../../services/DatabaseService.js'

function AddEmployee({ onClose, nv = {}, isEdit = false }) {
    const [conName, setConName] = useState(isEdit ? nv.name : '')
    const [conEmail, setConEmail] = useState(isEdit ? nv.email : '')
    const [conCCCD, setConCCCD] = useState(isEdit ? nv.identifyCard : '')
    const [conAddress, setConAddress] = useState(isEdit ? nv.address : '')
    const [conPhone, setConPhone] = useState(isEdit ? nv.phone : '')
    const [conSalary, setConSalary] = useState(isEdit ? nv.salary : '')
    const [conSex, setConSex] = useState(isEdit ? nv.gender : 'Nam')
    const [conPosition, setConPosition] = useState(isEdit ? nv.position : '')
    const [conWorkingTime, setConWorkingTime] = useState(isEdit ? nv.workHours : '')
    const formatDate = (date) => {
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
    }

    // Hàm chuyển đổi từ dd/MM/yyyy sang yyyy-MM-dd
    const parseDate = (date) => {
        const [day, month, year] = date.split('/')
        return `${year}-${month}-${day}`
    }

    // Khởi tạo state với ngày hiện tại
    const [conBirthDay, setConBirthDay] = useState(() => {
        const today = new Date()
        const yyyyMMdd = today.toISOString().split('T')[0]
        return formatDate(yyyyMMdd) // Định dạng dd/MM/yyyy
    })
    return (
        <div>
            <div className="z-ae-container w-100">
                <div className="z-ae-row-data row w-100">
                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập tên nhân viên"
                        name="Tên nhân viên"
                        value={conName}
                        onChange={(value) => {
                            setConName(value)
                        }}
                    ></TextFieldForm>
                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập email"
                        name="Email"
                        value={conEmail}
                        onChange={(value) => {
                            setConEmail(value)
                        }}
                    ></TextFieldForm>
                </div>
                <div className="z-ae-row-data row w-100">
                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập số CCCD/Passport"
                        name="Số CCCD/Passport"
                        value={conCCCD}
                        onChange={(value) => {
                            setConCCCD(value)
                        }}
                    ></TextFieldForm>
                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập địa chỉ"
                        name="Địa chỉ"
                        value={conAddress}
                        onChange={(value) => {
                            setConAddress(value)
                        }}
                    ></TextFieldForm>
                </div>
                <div className="z-ae-row-data row w-100">
                    <div className="repair-modal__input-item mb-3 col-6">
                        <label htmlFor="componentCode">{'Gioi tinh'}</label>
                        <ComboBox
                            height="90px"
                            options={[
                                { value: 'Nam', label: 'Nam' },
                                { value: 'Nữ', label: 'Nữ' },
                                { value: 'Bê đê', label: 'Bê đê' }
                            ]}
                            className="col-6"
                            placeholder="Chọn giới tính"
                            value={conSex}
                            onChange={(value) => {
                                setConSex(value)
                            }}
                        ></ComboBox>
                    </div>

                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập số điện thoại"
                        name="Số điện thoại"
                        value={conPhone}
                        onChange={(value) => {
                            setConPhone(value)
                        }}
                    ></TextFieldForm>
                </div>
                <div className="z-ae-row-data row w-100">
                    <div className="repair-modal__input-item col-6">
                        <label htmlFor="birthday">Ngày sinh</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="date"
                                id="birthday"
                                value={parseDate(conBirthDay)} // Chuyển về yyyy-MM-dd để hiển thị đúng
                                onChange={(e) => setConBirthDay(formatDate(e.target.value))} // Chuyển thành dd/MM/yyyy khi lưu
                            />
                            {/* <FontAwesomeIcon icon={faCalendar} className="input-form__icon" /> */}
                        </div>
                    </div>
                    <TextFieldForm
                        className="col-6"
                        hintText="Nhập mức lương"
                        name="Mức lương"
                        value={conSalary}
                        onChange={(value) => {
                            setConSalary(value)
                        }}
                    ></TextFieldForm>
                </div>
                <div className="z-ae-row-data row w-100">
                    <div className="repair-modal__input-item mb-3 col-6">
                        <label htmlFor="componentCode">{'Vị trí làm việc'}</label>
                        <ComboBox
                            height="70px"
                            options={[
                                { value: 'Kỹ thuật', label: 'Kỹ thuật' },
                                { value: 'Thu ngân', label: 'Thu ngân' },
                                { value: 'Quản lý', label: 'Quản lý' }
                            ]}
                            className="col-6"
                            placeholder="Chọn vị trí làm việc"
                            value={conPosition}
                            onChange={(value) => {
                                setConPosition(value)
                            }}
                        ></ComboBox>
                    </div>

                    <div className="repair-modal__input-item mb-3 col-6">
                        <label htmlFor="componentCode">{'Vị trí làm việc'}</label>
                        <ComboBox
                            height="70px"
                            options={[
                                { value: '07:00 - 17:00', label: '07:00 - 17:00' },
                                { value: '17:00 - 22:00', label: '17:00 - 22:00' },
                                { value: '07:00 - 12:00', label: '07:00 - 12:00' },
                                { value: '12:00 - 17:00', label: '12:00 - 17:00' }
                            ]}
                            className="col-6"
                            placeholder="Chọn giờ làm việc"
                            value={conWorkingTime}
                            onChange={(value) => {
                                setConWorkingTime(value)
                            }}
                        ></ComboBox>
                    </div>
                </div>
                <div className="page-btns end">
                    <button
                        className="repair-modal__button cancel-button"
                        onClick={() => {
                            onClose()
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        className="repair-modal__button confirm-button"
                        disabled={false}
                        onClick={async () => {
                            try {
                                if (!isEdit) {
                                    await dbService.add('employees', {
                                        name: conName,
                                        email: conEmail,
                                        identifyCard: conCCCD,
                                        address: conAddress,
                                        gender: conSex,
                                        phone: conPhone,
                                        birthday: conBirthDay,
                                        salary: conSalary,
                                        position: conPosition,
                                        workHours: conWorkingTime
                                    })
                                } else {
                                    await dbService.update('employees', nv.id, {
                                        name: conName,
                                        email: conEmail,
                                        identifyCard: conCCCD,
                                        address: conAddress,
                                        gender: conSex,
                                        phone: conPhone,
                                        birthday: conBirthDay,
                                        salary: conSalary,
                                        position: conPosition,
                                        workHours: conWorkingTime
                                    })
                                }

                                onClose()
                            } catch (error) {
                                alert(error.message)
                            } finally {
                                // setIsLoading(false)
                            }
                        }}
                    >
                        {isEdit ? 'Cập nhật' : 'Thêm'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddEmployee
