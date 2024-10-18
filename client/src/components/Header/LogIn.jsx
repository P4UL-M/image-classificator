import './Register.css';
import React, { useState, useEffect } from 'react';

function LogIn() {
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
        setError('');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        console.log('Form submitted:', { username, password });
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