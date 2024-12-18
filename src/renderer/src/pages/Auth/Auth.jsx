import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { db } from '../../firebase.config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import login1 from '../../assets/images/login/login_1.png'
import login2 from '../../assets/images/login/login_2.png'
import login3 from '../../assets/images/login/login_3.png'
import login4 from '../../assets/images/login/login_4.png'
import './Auth.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

function Auth() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleLogin = async () => {
        try {
            // Tạo query để kiểm tra user
            const usersRef = collection(db, 'users')
            const q = query(
                usersRef,
                where('userName', '==', username),
                where('password', '==', password)
            )

            // Thực hiện query
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                // Đăng nhập thành công
                console.log('Đăng nhập thành công')
                window.electron.ipcRenderer.send('resize-window')
                navigate('/dashboard')
            } else {
                // Đăng nhập thất bại
                alert('Tên đăng nhập hoặc mật khẩu không đúng')
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error.message)
            alert('Có lỗi xảy ra khi đăng nhập')
        }
    }

    return (
        <div className="auth">
            <div className="auth__form">
                <h1 className="auth__title">Đăng nhập</h1>
                <div className="auth__form-content">
                    <div className="auth__form-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <div className="auth__form-input">
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên đăng nhập"
                            />
                        </div>
                    </div>
                    <div className="auth__form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <div className="auth__form-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                color={showPassword ? '#5030e5' : '#7D848D'}
                                className="auth__form-icon"
                                onClick={handleShowPassword}
                            />
                        </div>
                    </div>
                </div>
                <button className="auth__button" onClick={handleLogin}>
                    <p>Đăng nhập</p>
                </button>
            </div>
            <div className="auth__image">
                <Swiper
                    style={{
                        '--swiper-pagination-color': '#fff'
                    }}
                    pagination={{
                        clickable: true
                    }}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="auth-swiper"
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false
                    }}
                    loop={true}
                >
                    <SwiperSlide>
                        <img src={login1} alt="logo" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={login2} alt="logo" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={login3} alt="logo" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={login4} alt="logo" />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    )
}

export default Auth
