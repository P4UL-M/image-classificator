import './Header.css'
import LogIn from '../components/Header/LogIn'
import SignUp from '../components/Header/SignUp'

function Header() {
    return (
        <div className="header">
            <div className='image'></div>
            <h1>Image Classificator</h1>
            <div className='register'>
                <SignUp />
                <LogIn />
            </div>
        </div>
    )
}

export default Header