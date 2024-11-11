import Sidebar from './sidebar.jsx'
import Header from './Header.jsx'
import { Outlet } from 'react-router-dom'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="main-layout">
      <Sidebar />
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
