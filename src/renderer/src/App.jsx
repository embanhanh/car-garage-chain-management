import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Setting from './pages/Setting/Setting'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
