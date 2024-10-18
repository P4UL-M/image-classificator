import './Header.css'
import LogIn from '../components/Header/LogIn'
import SignUp from '../components/Header/SignUp'
import Profile from '../components/Header/Profile'
import { useSelector } from 'react-redux'

function Header() {
    const isConnected = useSelector((state) => state.isConnected)

    return (
        <div className="header">
            <div className='image'></div>
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