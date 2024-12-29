import { useState, useEffect, useCallback, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faBell } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom'
import garageIcon from '../assets/images/icon/private-garage.png'
import { dbService } from '../services/DatabaseService'
import Modal from '../components/Modal'
import ChangePasswordModal from '../components/ChangePasswordModal'
import userImage from '../assets/images/default/user.png'
import './Header.css'

export default function Header() {
    const [isOpenChangePassword, setIsOpenChangePassword] = useState(false)
    const navigate = useNavigate()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('currentUser')
        window.api.send('resize-window-login')
        navigate('/')
    }

    const formatTime = (date) => {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
        const dayName = days[date.getDay()]
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')

        return `${dayName}, ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'))
        if (user) {
            setCurrentUser(user)
        }
    }, [navigate])

    return (
        <>
            <div className="header">
                <div className="header__garage-name">
                    <img src={garageIcon} alt="Garage Icon" className="header__garage-name-icon" />
                    <p className="header__garage-name-text"> Gagare Bình Dương</p>
                </div>
                <div className="header__time">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{formatTime(currentTime)}</span>
                </div>
                <div className="header__actions">
                    <FontAwesomeIcon icon={faBell} className="header__action-icon" />
                    <div className="header__user">
                        <div className="header__user-name">{currentUser?.employee?.name}</div>
                        <div className="header__user-avatar">
                            <img
                                src={currentUser?.employee?.avatar || userImage}
                                alt="User Avatar"
                            />
                        </div>
                    </div>
                    <div className="header__actions-mini-info">
                        <h2 className="text-center">
                            Chào mừng bạn trở lại Garage, {currentUser?.employee?.name}!
                        </h2>
                        <img
                            src={currentUser?.employee?.avatar || userImage}
                            alt="Logo"
                            className="header__actions-mini-info-img"
                        />
                        <h2>{currentUser?.employee?.name}</h2>
                        <p>{currentUser?.employee?.position}</p>
                        <span className="header__actions-mini-info-separate"></span>
                        <p>Thời gian làm việc</p>
                        <p>{currentUser?.employee?.workHours}</p>
                        <div className="page-btns center p-2">
                            <button className="primary-button" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                            <button
                                className="primary-button"
                                onClick={() => setIsOpenChangePassword(true)}
                            >
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isOpenChangePassword}
                onClose={() => setIsOpenChangePassword(false)}
                showHeader={false}
                width="300px"
            >
                <ChangePasswordModal
                    onClose={useCallback(() => setIsOpenChangePassword(false), [])}
                    onLogout={useCallback(() => handleLogout(), [])}
                />
            </Modal>
        </>
    )
}
