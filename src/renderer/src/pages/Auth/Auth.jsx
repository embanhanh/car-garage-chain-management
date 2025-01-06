import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { authService } from '../../services/AuthService'
import Swal from 'sweetalert2'
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
    const [loading, setLoading] = useState(false)

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleLogin = async () => {
        try {
            setLoading(true)
            if (!username || !password) {
                alert('Vui lòng nhập đầy đủ thông tin đăng nhập')
                return
            }
            const user = await authService.login(username, password)

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user))
                window.api.send('resize-window')
                if (user.role == 'admin') {
                    navigate('/garage-list')
                } else {
                    localStorage.setItem('currentGarage', JSON.stringify(user.employee?.garage))
                    navigate('/dashboard')
                }
            } else {
                Swal.fire({
                    title: 'Thất bại!',
                    text: 'Tên đăng nhập hoặc mật khẩu không đúng',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        } catch (error) {
            Swal.fire({
                title: 'Thất bại!',
                text: 'Có lỗi xảy ra khi đăng nhập',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        } finally {
            setLoading(false)
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
                <button className="auth__button" onClick={handleLogin} disabled={loading}>
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
