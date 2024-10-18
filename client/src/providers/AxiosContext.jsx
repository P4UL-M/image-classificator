import React, { createContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AxiosContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AxiosProvider = ({ children }) => {
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};

export { AxiosContext, AxiosProvider };
