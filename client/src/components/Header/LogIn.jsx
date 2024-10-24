import './Register.css';
import { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosContext } from '../../providers/AxiosContext';
import { LOGIN } from '../../store';

function LogIn() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const { publicAxios } = useContext(AxiosContext);

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setError('');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await publicAxios.post('/login', { email, password });
            if (response.status === 200) {
                dispatch({ type: LOGIN, payload: response.data.token });
                closeModal();
            } else {
                if (response.status === 401) {
                    setError('Invalid credentials');
                } else {
                    setError('Error logging in');
                }
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Invalid credentials');
            } else {
                setError('Error logging in');
                console.error('Error logging in:', error);
            }
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <button className='LogIn' onClick={openModal}>Log In</button>

            {showModal ? (
                <div className='modalBackground' onClick={closeModal}>
                    <div className='modalContainer' onClick={e => e.stopPropagation()}>
                        <h2>Log In</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='email'>Email:</label>
                            <input
                                type='text'
                                id='email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor='password'>Password:</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type='submit'>Log In</button>
                            {error && <p className='error'>{error}</p>}
                        </form>
                        <button className='closeButton' onClick={closeModal}>Close</button>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default LogIn