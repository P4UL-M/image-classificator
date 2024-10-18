import './Register.css';
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosContext } from '../../providers/AxiosContext';

function Profile() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const user = useSelector((state) => state.user);
    const axios = useContext(AxiosContext);

    useEffect(() => {
        axios.get('/whoami')
            .then((response) => {
                console.log('response', response);
                dispatch({ type: 'SET_USER', payload: response.data });
            })
            .catch((error) => {
                console.error('Error fetching profile:', error);
            });
    }, [axios, dispatch]);

    return (
        <div>
            <h1>{user?.username}</h1>
        </div>
    );
}

export default Profile;