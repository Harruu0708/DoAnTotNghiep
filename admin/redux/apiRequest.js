import axios from 'axios';
import { loginStart, loginSuccess, loginFailure, setToken, removeToken } from './authSlice';
import { useSelector } from 'react-redux';
const BASE_URL = "http://localhost:8000";
import { toast } from 'react-toastify';

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
            navigate('/');
            toast.success('Đăng nhập thành công!');
        }
        else{
        navigate('/');
        toast.error('Tài khoản không có quyền truy cập!');
        }
        
    } catch (error) {
        dispatch(loginFailure());
        console.log(error);
        toast.error('Đăng nhập thất bại!');
    }
};

export const logoutUser = async (dispatch, navigate) => {
    try {
        await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
            withCredentials: true,
        });
        dispatch(removeToken());
        toast.success('Đăng xuất thành công!');
        navigate('/');
    } catch (error) {
        console.log(error);
        toast.error('Đăng xuất thất bại!');
    }
};