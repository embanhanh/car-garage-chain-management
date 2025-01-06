import TextFieldForm from '../../components/text_field'
import './add_employee.css'
import { useState } from 'react'
import ComboBox from '../../components/Combobox.jsx'
import { dbService } from '../../services/DatabaseService.js'
import Modal from '../../components/Modal.jsx'
import { addEmployee, updateEmployee } from '../../controllers/emplyeeController'
import { format, parse, isValid } from 'date-fns'

function AddEmployee({ onClose, nv = {}, isEdit = false }) {
    const [conName, setConName] = useState(isEdit ? nv.name : '')
    const [conEmail, setConEmail] = useState(isEdit ? nv.email : '')
    const [conCCCD, setConCCCD] = useState(isEdit ? nv.identifyCard : '')
    const [conAddress, setConAddress] = useState(isEdit ? nv.address : '')
    const [conPhone, setConPhone] = useState(isEdit ? nv.phone : '')
    const [conSalary, setConSalary] = useState(
        isEdit ? Number(nv.salary).toLocaleString('vi-VN') : ''
    )
    const [conSex, setConSex] = useState(isEdit ? nv.gender : 'Nam')
    const [conPosition, setConPosition] = useState(isEdit ? nv.position : '')
    const [conWorkingTime, setConWorkingTime] = useState(isEdit ? nv.workHours : '')

    const [isShowAlertlog, setIsShowAlertlog] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // Hàm chuyển đổi từ yyyy-MM-dd sang dd/MM/yyyy
    const formatDate = (dateStr) => {
        try {
            const date = parse(dateStr, 'yyyy-MM-dd', new Date())
            if (!isValid(date)) return format(new Date(), 'dd/MM/yyyy')
            return format(date, 'dd/MM/yyyy')
        } catch (error) {
            console.error('Error formatting date:', error)
            return format(new Date(), 'dd/MM/yyyy')
        }
    }

    // Hàm chuyển đổi từ dd/MM/yyyy sang yyyy-MM-dd
    const parseDate = (dateStr) => {
        try {
            const date = parse(dateStr, 'dd/MM/yyyy', new Date())
            if (!isValid(date)) return format(new Date(), 'yyyy-MM-dd')
            return format(date, 'yyyy-MM-dd')
        } catch (error) {
            console.error('Error parsing date:', error)
            return format(new Date(), 'yyyy-MM-dd')
        }
    }

    const [conBirthDay, setConBirthDay] = useState(() => {
        try {
            if (isEdit && nv.birthday) {
                // Kiểm tra nếu đã là định dạng dd/MM/yyyy
                if (nv.birthday.includes('/')) {
                    return nv.birthday
                }

                // Nếu là định dạng khác, parse và format lại
                const date = new Date(nv.birthday)
                if (isValid(date)) {
                    return format(date, 'dd/MM/yyyy')
                }
            }

            // Mặc định hoặc nếu có lỗi, dùng ngày hiện tại
            return format(new Date(), 'dd/MM/yyyy')
        } catch (error) {
            console.error('Error setting birthday:', error)
            return format(new Date(), 'dd/MM/yyyy')
        }
    })

    return (
        <>
            <div className="z-ae-container w-100">
                <Modal
                    isOpen={isShowAlertlog}
                    onClose={() => setIsShowAlertlog(false)}
                    showHeader={false}
                    width="350px"
                >
                    <div className="center">
                        <p className="text-center fw-bold fs-20 text-danger error-message">Lỗi</p>
                        <p className="text-center fw-bold fs-20 text-danger">{errorMessage}</p>
                    </div>
                </Modal>
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
                                value={parseDate(conBirthDay)}
                                onChange={(e) => setConBirthDay(formatDate(e.target.value))}
                            />
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
                                if (
                                    !conName ||
                                    !conEmail ||
                                    !conCCCD ||
                                    !conAddress ||
                                    !conSex ||
                                    !conPhone ||
                                    !conBirthDay ||
                                    !conSalary ||
                                    !conPosition ||
                                    !conWorkingTime
                                ) {
                                    setErrorMessage('Vui lòng nhập đầy đủ thông tin')
                                    setIsShowAlertlog(true)
                                    return
                                }
                                if (!isEdit) {
                                    // await dbService.add('employees', {
                                    //     name: conName,
                                    //     email: conEmail,
                                    //     identifyCard: conCCCD,
                                    //     address: conAddress,
                                    //     gender: conSex,
                                    //     phone: conPhone,
                                    //     birthday: conBirthDay,
                                    //     salary: conSalary,
                                    //     position: conPosition,
                                    //     workHours: conWorkingTime
                                    // })
                                    await addEmployee({
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
                                    await updateEmployee(nv.id, {
                                        name: conName,
                                        email: conEmail,
                                        identifyCard: conCCCD,
                                        address: conAddress,
                                        gender: conSex,
                                        phone: conPhone,
                                        birthday: conBirthDay,
                                        salary: conSalary.replace(/[.,]/g, ''),
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
        </>
    )
}

export default AddEmployee
