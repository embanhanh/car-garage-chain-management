import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Setting from './pages/Setting/Setting'
import Auth from './pages/Auth/Auth'
import MainLayout from './layout/MainLayout'
import Employee from './pages/Employee/Employee'
import Customer from './pages/Customer/Customer'
import Component from './pages/Component/Component'
import Car from './pages/Car/Car'
function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="setting" element={<Setting />} />
            <Route path="employee" element={<Employee />} />
            <Route path="customer" element={<Customer />} />
            <Route path="car" element={<Car />} />
            {/* <Route path="repair" element={<Repair />} /> */}
            <Route path="component" element={<Component />} />
            {/* <Route path="report" element={<Report />} />
            <Route path="regulation" element={<Regulation />} /> */}
          </Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
