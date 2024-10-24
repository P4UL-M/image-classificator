import './App.css'
import Header from './layout/Header'
import UploadButton from './components/UploadButton'
import SendButton from './components/SendButton'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import HomePage from './layout/HomePage'

function App() {
  const token = useSelector((state) => state.token)
  const [image, setImage] = useState(null)

  const handleImageUpload = (image) => {
    setImage(image)
  }

  const handleRemoveImage = () => {
    setImage(null)
  }

  return (
    <>
      <Header />
      <div className="container">
        { token ? (
          <>
            <UploadButton onImageUpload={handleImageUpload} onImageRemove={handleRemoveImage}/>
            <SendButton image={image}/>
          </>
        ) : (
          <HomePage />
        )}
      </div>
    </>
  )
}

export default App
