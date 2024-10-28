import './App.css'
import Header from './layout/Header'
import { useSelector } from 'react-redux'
import HomePage from './pages/HomePage'
import ClassifyPage from './pages/ClassifyPage'

function App() {
  const token = useSelector((state) => state.token)

  return (
    <div>
      <Header />
      <div className="container">
        { token ? (
          <ClassifyPage />
        ) : (
          <HomePage />
        )}
      </div>
    </div>
  )
}

export default App
