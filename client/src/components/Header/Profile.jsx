import './Register.css';
import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosContext } from '../../providers/AxiosContext';
import { SET_USER } from '../../store';

function Profile() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const { authAxios } = useContext(AxiosContext);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authAxios.get('/whoami');
                dispatch({ type: SET_USER, payload: response.data });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        fetchProfile();
    }, [authAxios, dispatch]);

    return (
        <div>
            <h1>{user?.username}</h1>
        </div>
    );
}

export default Profile;