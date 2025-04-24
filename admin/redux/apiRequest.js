import axios from 'axios';
import { loginStart, loginSuccess, loginFailure, setToken, removeToken } from './authSlice';
import { useSelector } from 'react-redux';
const BASE_URL = "http://localhost:8000";

export const loginUser = async (dispatch, user, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${BASE_URL}/api/auth/login-admin`, user, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",}
        });
        dispatch(loginSuccess(res.data));
        if(res.data.others.admin === true){
            window.location.href = 'http://localhost:5174';
        }
        else{
        navigate('/');
        }
        
    } catch (error) {
        dispatch(loginFailure());
        console.log(error);
    }
};

export const logoutUser = async (dispatch, navigate, token) => {
    try {
        await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}` // Gửi token trong header Authorization
            }
        });
        dispatch(removeToken());
        navigate('/');
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};