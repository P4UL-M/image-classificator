import './App.css'
import Header from './layout/Header'
import UploadButton from './components/UploadButton'
import SendButton from './components/SendButton'
import { useSelector } from 'react-redux'
import { useState } from 'react'

function App() {
  const token = useSelector((state) => state.token)
  const [image, setImage] = useState(null)

  const handleImageUpload = (image) => {
    setImage(image)
  }

  return (
    <>
      <Header />
      <div className="container">
        <UploadButton onImageUpload={handleImageUpload}/>
        {token && <SendButton image={image}/>}
      </div>
    </>
  )
}

export default App
