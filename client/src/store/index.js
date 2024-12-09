import { configureStore } from '@reduxjs/toolkit';
import { loadState, saveState } from './sessionStorage';

const persistState = loadState();

const initialState = persistState || {
    isConnected: false,
    token: null,
    user: {
        email: '',
        username: '',
        balance: 0
    }
};

const SET_USER = 'SET_USER';
const LOGOUT_USER = 'LOGOUT_USER';
const LOGIN = 'LOGIN';

export { SET_USER, LOGOUT_USER, LOGIN };

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

export const logoutUser = () => ({
    type: LOGOUT_USER,
    payload: null
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
                user: action.payload
            };
        case LOGOUT_USER:
            return {
                ...state,
                isConnected: false,
                token: null,
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
},);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;