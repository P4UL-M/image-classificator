import './Register.css';
import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosContext } from '../../providers/AxiosContext';

function LogIn() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const axios = useContext(AxiosContext);

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
        // fetch('http://localhost:3000/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email, password }),
        // })
        //     .then((response) => {
        //         if (response.ok) {
        //             response.json().then(data => dispatch({ type: 'SET_USER', payload: data.token }));
        //             closeModal();
        //         } else {
        //             setError('Error logging in');
        //         }
        //     })
        //     .catch((error) => {
        //         setError('Error logging in');

        //         console.error('Error logging in:', error);
        //     });
        try {
            const response = await axios.post('/login', { email, password });
            if (response.status === 200) {
                dispatch({ type: 'LOGIN', payload: response.data.token });
                closeModal();
            } else {
                setError('Error logging in');
            }
        } catch (error) {
            setError('Error logging in');
            console.error('Error logging in:', error);
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