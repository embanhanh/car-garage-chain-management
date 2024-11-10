import { useNavigate } from 'react-router-dom'

function Auth() {
  const navigate = useNavigate()

  return (
    <>
      <button
        onClick={() => {
          window.electron.ipcRenderer.send('resize-window')
          navigate('/dashboard')
        }}
      >
        Đăng nhập
      </button>
    </>
  )
}

export default Auth
