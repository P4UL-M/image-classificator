import './Register.css';
import { useState, useEffect, useContext } from 'react';
import { AxiosContext } from '../../providers/AxiosContext';

function SignUp() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { publicAxios } = useContext(AxiosContext);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else {
            setError('');
            try {
                await publicAxios.post('/register', { email, username, password });
                closeModal();
            } catch (error) {
                if (error.response?.status === 400) {
                    setError('Missing required fields');
                } else {
                    setError('Error signing up');
                    console.error('Error signing up:', error);
                }
            }
        }
    };

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
            <button className='SignUp' onClick={openModal}>Sign Up</button>

            {showModal ? (
                <div className='modalBackground' onClick={closeModal}>
                    <div className='modalContainer' onClick={e => e.stopPropagation()}>
                        <h2>Sign Up</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='email'>Email:</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor='username'>Username:</label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                            <label htmlFor='confirmPassword'>Confirm Password:</label>
                            <input
                                type='password'
                                id='confirmPassword'
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && <p className='error'>{error}</p>}
                            <button type='submit'>Sign Up</button>
                        </form>
                        <button className='closeButton' onClick={closeModal}>Close</button>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default SignUp;