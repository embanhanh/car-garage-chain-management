import TextFieldForm from '../../components/text_field'
import { useState } from 'react'
import ComboBox from '../../components/Combobox.jsx'
import { dbService } from '../../services/DatabaseService.js'
import { authService } from '../../services/AuthService.js'

function AddAccount({ onClose, idNV = 'zont09', role = 'nhanvien' }) {
    const [conUserName, setConUserName] = useState('')
    const [conPassword, setConPassword] = useState('')
    const [conRepeatPassword, setConRepeatPassword] = useState('')
    return (
        <div className="z-ae-container w-100 col">
            <TextFieldForm
                className=""
                hintText="Nhập tên đăng nhập"
                name="Tên đăng nhập"
                onChange={(value) => {
                    setConUserName(value)
                }}
            ></TextFieldForm>
            <TextFieldForm
                type="password"
                className=""
                hintText="Nhập mật khẩu"
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
                        try {
                            const hasPassword = await authService.hashPassword(conPassword);
                            await dbService.add('users', {
                                employeeId: idNV,
                                userName: conUserName,
                                password: hasPassword,
                                role: role
                            })
                            onClose()
                        } catch (error) {
                            alert(error.message)
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
