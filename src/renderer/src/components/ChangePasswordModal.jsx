import { useState, memo, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { authService } from '../services/AuthService'
import Swal from 'sweetalert2'

function ChangePasswordModal({ onClose, onLogout }) {
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState({
        password: false,
        newPassword: false,
        confirmPassword: false
    })
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const changePassword = async () => {
        try {
            setIsLoading(true)
            if (password === '' || newPassword === '' || confirmPassword === '') {
                throw new Error('Vui lòng nhập đầy đủ các trường')
            }
            if (newPassword !== confirmPassword) {
                throw new Error('Mật khẩu mới và mật khẩu nhập lại không khớp')
            }
            await authService.changePassword(currentUser.id, password, newPassword)
            await Swal.fire({
                title: 'Thành công!',
                text: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.',
                icon: 'success',
                confirmButtonText: 'OK'
            })
            onLogout()
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleShowPassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] })
    }

    useEffect(() => {
        if (error) {
            setError('')
        }
    }, [password, newPassword, confirmPassword])

    return (
        <>
            <div className="gap-3 d-flex flex-column">
                <div className="row">
                    <div className="col-12">
                        <label className="label-for-input">Tên đăng nhập</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type="text"
                                value={currentUser?.userName || ''}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <label className="label-for-input">Mật khẩu cũ</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type={showPassword.password ? 'text' : 'password'}
                                value={password || ''}
                                placeholder="Nhập mật khẩu cũ"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword.password ? faEyeSlash : faEye}
                                color={showPassword.password ? '#5030e5' : '#7D848D'}
                                className="auth__form-icon"
                                onClick={() => handleShowPassword('password')}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <label className="label-for-input">Mật khẩu mới</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type={showPassword.newPassword ? 'text' : 'password'}
                                value={newPassword || ''}
                                placeholder="Nhập mật khẩu mới"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword.newPassword ? faEyeSlash : faEye}
                                color={showPassword.newPassword ? '#5030e5' : '#7D848D'}
                                className="auth__form-icon"
                                onClick={() => handleShowPassword('newPassword')}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <label className="label-for-input">Nhập lại mật khẩu mới</label>
                        <div className="input-form">
                            <input
                                className="w-100"
                                type={showPassword.confirmPassword ? 'text' : 'password'}
                                value={confirmPassword || ''}
                                placeholder="Nhập lại mật khẩu mới"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={showPassword.confirmPassword ? faEyeSlash : faEye}
                                color={showPassword.confirmPassword ? '#5030e5' : '#7D848D'}
                                className="auth__form-icon"
                                onClick={() => handleShowPassword('confirmPassword')}
                            />
                        </div>
                    </div>
                </div>
                <p className="error-message text-center">{error}</p>
                <div className="page-btns center">
                    <button className="page__header-button" onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        className="primary-button"
                        disabled={isLoading}
                        onClick={changePassword}
                    >
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        </>
    )
}

export default memo(ChangePasswordModal)
