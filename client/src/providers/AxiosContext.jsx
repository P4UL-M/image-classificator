import { createContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT_USER } from '../store';


const AxiosContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const AxiosProvider = ({ children }) => {

    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();

    const publicAxios = axios.create({
        baseURL: BASE_URL,
    });

    const authAxios = axios.create({
        baseURL: BASE_URL,
    });

    authAxios.interceptors.request.use((config) => {
        if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    authAxios.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        if (error.response.status === 403 && token !== null) {
            dispatch({ type: LOGOUT_USER });
        }
        return Promise.reject(error);
    });

    return (
        <AxiosContext.Provider value={{publicAxios, authAxios}}>
        {children}
        </AxiosContext.Provider>
    );
};

AxiosProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AxiosContext, AxiosProvider };
