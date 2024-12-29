import TextFieldForm from '../../components/text_field'
import { useState } from 'react'
import ComboBox from '../../components/Combobox.jsx'
import { dbService } from '../../services/DatabaseService.js'
import Modal from '../../components/Modal.jsx'

function AddCustomer({ onClose, kh = {}, isEdit = false }) {
    const [conName, setConName] = useState(isEdit ? kh.name : '')
    const [conEmail, setConEmail] = useState(isEdit ? kh.email : '')
    const [conCCCD, setConCCCD] = useState(isEdit ? kh.identifyCard : '')
    const [conAddress, setConAddress] = useState(isEdit ? kh.address : '')
    const [conPhone, setConPhone] = useState(isEdit ? kh.phone : '')
    

    const [isShowAlertlog, setIsShowAlertlog] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
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
        const today = isEdit ? new Date(kh.birthday) : new Date()
        const yyyyMMdd = today.toISOString().split('T')[0]
        return formatDate(yyyyMMdd) // Định dạng dd/MM/yyyy
    })


    return (
        <div>
            <div className="z-ae-container w-100">
                <Modal
                    isOpen={isShowAlertlog}
                    onClose={() => setIsShowAlertlog(false)}
                    showHeader={false}
                    width="350px"
                >
                    <div className="center">
                        <p className="text-center fw-bold fs-20 text-danger error-message">Lỗi</p>
                        <p className='text-center fw-bold fs-20 text-danger'>{errorMessage}</p>
                    </div>
                </Modal>
                <div className="z-ae-row-data row w-100">
                    <TextFieldForm
                        className="col-6"
                        hintText="Phạm Ngọc Thịnh"
                        name="Tên khách hàng"
                        value={conName}
                        onChange={(value) => {
                            setConName(value)
                        }}
                    ></TextFieldForm>
                    <TextFieldForm
                        className="col-6"
                        hintText="zontcn09@gmail.com"
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
                        hintText="042104007362"
                        name="Số CCCD/Passport"
                        value={conCCCD}
                        onChange={(value) => {
                            setConCCCD(value)
                        }}
                    ></TextFieldForm>
                    <TextFieldForm
                        className="col-6"
                        hintText="Nghĩa Kỳ, Tư Nghĩa, Quảng Ngãi"
                        name="Địa chỉ"
                        value={conAddress}
                        onChange={(value) => {
                            setConAddress(value)
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
                        hintText="0918078123"
                        name="Số điện thoại"
                        value={conPhone}
                        onChange={(value) => {
                            setConPhone(value)
                        }}
                    ></TextFieldForm>
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
                                    !conPhone ||
                                    !conBirthDay 
                                ) {
                                    setErrorMessage("Vui lòng nhập đầy đủ thông tin")
                                    setIsShowAlertlog(true)
                                    return
                                }
                                if (!isEdit) {
                                    await dbService.add('customers', {
                                        name: conName,
                                        email: conEmail,
                                        identifyCard: conCCCD,
                                        address: conAddress,
                                        phone: conPhone,
                                        birthday: conBirthDay,
                                    })
                                } else {
                                    await dbService.update('customers', kh.id, {
                                        name: conName,
                                        email: conEmail,
                                        identifyCard: conCCCD,
                                        address: conAddress,
                                        phone: conPhone,
                                        birthday: conBirthDay,
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

export default AddCustomer
