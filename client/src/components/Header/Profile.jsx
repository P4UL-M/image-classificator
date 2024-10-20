import './Register.css';
import { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosContext } from '../../providers/AxiosContext';

function Profile() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { authAxios } = useContext(AxiosContext);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authAxios.get('/whoami');
                dispatch({ type: 'SET_USER', payload: response.data });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        fetchProfile();
    }, [authAxios, dispatch]);

    return (
        <div>
            <h1 onClick={openModal} className='username'>{user?.username}</h1>

            { 
                showModal ? (
                    <div className='modalBackground' onClick={closeModal}>
                        <div className='modalContainer' onClick={e => e.stopPropagation()}>
                            <h1 className='modalHeading'>Username</h1>
                            <h2 className='modalDetails'>{user?.username}</h2>

                            <h1 className='modalHeading'>Email</h1>
                            <h2 className='modalDetails'>{user?.email}</h2>

                            <h1 className='modalHeading'>Balance</h1>
                            <h2 className='modalDetails'>{user?.balance}</h2>

                            <button className='logoutButton' onClick={() => dispatch({ type: 'LOGOUT_USER' })}>Logout</button>
                            <button className='closeButton' onClick={closeModal}>Close</button>
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
}

export default Profile;