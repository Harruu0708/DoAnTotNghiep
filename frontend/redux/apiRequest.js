import axios from 'axios';
import { loginStart, loginSuccess, loginFailure, setToken, removeToken, registerStart, registerSuccess, registerFailure } from './authSlice';
import { useSelector } from 'react-redux';
const BASE_URL = "http://localhost:8000";

import { toast } from 'react-toastify';

export const loginUser = async (dispatch, user, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${BASE_URL}/api/auth/login`, user, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",}
        });
        dispatch(loginSuccess(res.data));
        toast.success('Đăng nhập thành công!');
        navigate('/');
    } catch (error) {
        dispatch(loginFailure());
        console.log(error);
        toast.error('Đăng nhập thất bại!');
    }
};

export const registerUser = async (dispatch, user, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post(`${BASE_URL}/api/auth/register`, user, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        });
        dispatch(registerSuccess(res.data));
        window.location.reload();
        toast.success('Đăng ký thành công!');
    } catch (error) {
        dispatch(registerFailure());
        console.log(error)
        toast.error('Đăng ký thất bại!');
    }
};

//Log out
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
        toast.success('Đăng xuất thành công!');
        window.location.reload();
    } catch (error) {
        console.log(error);
        toast.error('Đăng xuất thất bại!');
    }
};
