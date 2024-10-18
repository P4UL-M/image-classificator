import { configureStore } from '@reduxjs/toolkit';

const initialState = {
    isConnected: false,
    token: '',
    user: {
        email: '',
        username: '',
        balance: 0
    }
};

const SET_USER = 'SET_USER';
const LOGOUT_USER = 'LOGOUT_USER';
const LOGIN = 'LOGIN';

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

export const logoutUser = () => ({
    type: LOGOUT_USER
});

export const login = (token) => ({
    type: LOGIN,
    payload: token
});

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                isConnected: true,
                user: action.payload
            };
        case LOGOUT_USER:
            return {
                ...state,
                isConnected: false,
                user: {
                    email: '',
                    username: '',
                    balance: 0
                }
            };
        case LOGIN:
            return {
                ...state,
                isConnected: true,
                token: action.payload
            };
        default:
            return state;
    }
};

const store = configureStore({
    reducer: userReducer
});

export default store;