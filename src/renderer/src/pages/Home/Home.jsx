import { useNavigate } from 'react-router-dom'

function Home() {
  const nav = useNavigate()
  return (
    <>
      <h1>Anh Trường go Home</h1>
      <button
        onClick={() => {
          nav('/setting')
        }}
      >
        go Setting
      </button>
    </>
  )
}

export default Home
