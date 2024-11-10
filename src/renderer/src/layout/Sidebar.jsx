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
  faChartLine,
  faFileContract
} from '@fortawesome/free-solid-svg-icons'
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <img src={logo} alt="logo" className="sidebar__logo" />
      </div>
      <div className="sidebar__menu">
        <Link to="/dashboard" className="sidebar__menu-item sidebar__menu-item--active">
          <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faHome} />
          Trang chủ
        </Link>
        <Link to="/dashboard/employee" className="sidebar__menu-item">
          <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faUserTie} />
          Nhân viên
        </Link>
        <Link to="/dashboard/customer" className="sidebar__menu-item">
          <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faUser} />
          Khách hàng
        </Link>
        <Link to="/dashboard/car" className="sidebar__menu-item">
          <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faCar} />
          Hồ sơ xe
        </Link>
        <Link to="/dashboard/repair" className="sidebar__menu-item">
          <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faScrewdriverWrench} />
          Sửa chữa
        </Link>
        <Link to="/dashboard/component" className="sidebar__menu-item">
          <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faGear} />
          Phụ tùng
        </Link>
        <Link to="/dashboard/report" className="sidebar__menu-item">
          <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faChartLine} />
          Thống kê
        </Link>
        <Link to="/dashboard/regulation" className="sidebar__menu-item">
          <FontAwesomeIcon className="sidebar__menu-item-icon" icon={faFileContract} />
          Quy định
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
