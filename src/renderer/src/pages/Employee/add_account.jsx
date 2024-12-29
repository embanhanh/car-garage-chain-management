import TextFieldForm from '../../components/text_field'
import { useState } from 'react'
import ComboBox from '../../components/Combobox.jsx'
import { dbService } from '../../services/DatabaseService.js'
import { authService } from '../../services/AuthService.js'
import Swal from 'sweetalert2'

function AddAccount({ onClose, idNV = 'zont09', role = 'nhanvien' }) {
    const [conUserName, setConUserName] = useState('')
    const [conPassword, setConPassword] = useState('')
    const [conRepeatPassword, setConRepeatPassword] = useState('')
    return (
        <div className="z-ae-container w-100 col">
            <TextFieldForm
                className=""
                hintText="Nhập tên đăng nhập"
                value={conUserName}
                name="Tên đăng nhập"
                onChange={(value) => {
                    setConUserName(value)
                }}
            ></TextFieldForm>
            <TextFieldForm
                type="password"
                className=""
                hintText="Nhập mật khẩu"
                value={conPassword}
                name="Mật khẩu"
                onChange={(value) => {
                    setConPassword(value)
                }}
            ></TextFieldForm>
            <TextFieldForm
                type="password"
                className=""
                hintText="Xác nhận mật khẩu"
                name="Nhập lại mật khẩu"
                value={conRepeatPassword}
                onChange={(value) => {
                    setConRepeatPassword(value)
                }}
            ></TextFieldForm>
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
                        if (conPassword !== conRepeatPassword) {
                            Swal.fire({
                                title: 'Thất bại!',
                                text: 'Mật khẩu không khớp',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                            return
                        }
                        try {
                            await authService.createUser({
                                userName: conUserName,
                                password: conPassword,
                                employeeId: idNV,
                                role: role
                            })
                            await Swal.fire({
                                title: 'Thành công!',
                                text: 'Tạo tài khoản thành công',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            })

                            onClose()
                        } catch (error) {
                            Swal.fire({
                                title: 'Thất bại!',
                                text: error.message,
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                        } finally {
                            // setIsLoading(false)
                        }
                    }}
                >
                    Thêm
                </button>
            </div>
        </div>
    )
}

export default AddAccount
