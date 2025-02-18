import './Sidebar.css'
import logo from '../assets/images/logo/logo.png'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHome,
    faUser,
    faUserTie,
    faCar,
    faScrewdriverWrench,
    faGear,
    faBuilding,
    faChartLine,
    faFileContract,
    faFileInvoice
} from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom'
function Sidebar() {
    const location = useLocation()
    const currentGarage = JSON.parse(localStorage.getItem('currentGarage'))
    console.log(currentGarage)

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <img src={logo} alt="logo" className="sidebar__logo" />
            </div>
            <div className="sidebar__menu">
                {JSON.parse(localStorage.getItem('currentUser'))?.role == 'admin' && (
                    <>
                        <Link
                            to="/garage-list"
                            onClick={() => {
                                localStorage.removeItem('currentGarage')
                            }}
                            className={`sidebar__menu-item ${
                                location.pathname === '/garage-list'
                                    ? 'sidebar__menu-item--active'
                                    : ''
                            }`}
                        >
                            <FontAwesomeIcon
                                className="sidebar__menu-item-icon"
                                icon={faBuilding}
                            />
                            Garages
                        </Link>
                    </>
                )}
                {currentGarage && (
                    <>
                        <Link
                            to="/dashboard"
                            className={`sidebar__menu-item ${location.pathname === '/dashboard' ? 'sidebar__menu-item--active' : ''}`}
                        >
                            <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faHome} />
                            Trang chủ
                        </Link>
                        <Link
                            to="/dashboard/employee"
                            className={`sidebar__menu-item ${
                                location.pathname === '/dashboard/employee'
                                    ? 'sidebar__menu-item--active'
                                    : ''
                            }`}
                        >
                            <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faUserTie} />
                            Nhân viên
                        </Link>
                        <Link
                            to="/dashboard/customer"
                            className={`sidebar__menu-item ${
                                location.pathname === '/dashboard/customer'
                                    ? 'sidebar__menu-item--active'
                                    : ''
                            }`}
                        >
                            <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faUser} />
                            Khách hàng
                        </Link>
                        <Link
                            to="/dashboard/car"
                            className={`sidebar__menu-item ${
                                location.pathname === '/dashboard/car'
                                    ? 'sidebar__menu-item--active'
                                    : ''
                            }`}
                        >
                            <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faCar} />
                            Hồ sơ xe
                        </Link>
                        <Link
                            to="/dashboard/repair"
                            className={`sidebar__menu-item ${
                                location.pathname === '/dashboard/repair'
                                    ? 'sidebar__menu-item--active'
                                    : ''
                            }`}
                        >
                            <FontAwesomeIcon
                                className="sidebar__menu-item-icon"
                                icon={faScrewdriverWrench}
                            />
                            Sửa chữa
                        </Link>
                        <Link
                            to="/dashboard/bill"
                            className={`sidebar__menu-item ${
                                location.pathname === '/dashboard/bill'
                                    ? 'sidebar__menu-item--active'
                                    : ''
                            }`}
                        >
                            <FontAwesomeIcon
                                className="sidebar__menu-item-icon"
                                icon={faFileInvoice}
                            />
                            Hóa đơn
                        </Link>
                        <Link
                            to="/dashboard/component"
                            className={`sidebar__menu-item ${
                                location.pathname === '/dashboard/component'
                                    ? 'sidebar__menu-item--active'
                                    : ''
                            }`}
                        >
                            <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faGear} />
                            Phụ tùng
                        </Link>
                    </>
                )}

                <Link
                    to="/dashboard/report"
                    className={`sidebar__menu-item ${
                        location.pathname === '/dashboard/report'
                            ? 'sidebar__menu-item--active'
                            : ''
                    }`}
                >
                    <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faChartLine} />
                    Thống kê
                </Link>
                <Link
                    to="/dashboard/regulation"
                    className={`sidebar__menu-item ${
                        location.pathname === '/dashboard/regulation'
                            ? 'sidebar__menu-item--active'
                            : ''
                    }`}
                >
                    <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faFileContract} />
                    Quy định
                </Link>
            </div>
        </div>
    )
}

export default Sidebar
