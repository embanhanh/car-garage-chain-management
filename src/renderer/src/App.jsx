import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Setting from './pages/Setting/Setting'
import Auth from './pages/Auth/Auth'
import MainLayout from './layout/MainLayout'

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
          </Route>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
