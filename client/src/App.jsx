import './App.css'
import Header from './layout/Header'
import { useSelector } from 'react-redux'
import HomePage from './pages/HomePage'
import ClassifyPage from './pages/ClassifyPage'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

function App() {
  const token = useSelector((state) => state.token)

  return (
    <Router basename="/image-classificator">
      <Header />
      <div className="container">
        <Routes>
          <Route path="/classify" element={token ? <ClassifyPage /> : <Navigate to="/" />} />
          <Route path="/" element={token ? <Navigate to="/classify" /> : <HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
