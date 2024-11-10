import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Setting from './pages/Setting/Setting'
import Auth from './pages/Auth/Auth'
function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
