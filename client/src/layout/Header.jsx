import './Header.css'
import LogIn from '../components/Header/LogIn'
import SignUp from '../components/Header/SignUp'
import Profile from '../components/Header/Profile'
import { useSelector } from 'react-redux'
// import image from '../assets/image.png'

function Header() {
    const isConnected = useSelector((state) => state.isConnected)

    return (
        <div className="header">
            {/* <img src={image} className='image' alt="logo" /> */}
            <div className='logo'></div>
            <h1>Image Classificator</h1>
            <div className='register'>
                {
                    isConnected
                        ? <Profile />
                        : <>
                            <SignUp />
                            <LogIn />
                        </>
                }
            </div>
        </div>
    )
}

export default Header