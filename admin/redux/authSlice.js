import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        login:{
            currentUser: null,
            isFetching: false,
            error: false,
        },
        token:{
            accessToken: "",
        },
    },
    reducers:{
        loginStart: (state) =>{
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) =>{
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailure: (state) =>{
            state.login.isFetching = false;
            state.login.error = true;
        },
        setToken: (state, action) =>{
            state.token.accessToken = action.payload;
        },
        removeToken: (state) =>{
            state.token.accessToken = "";
            state.login.currentUser = null;
            state.login.isFetching = false;
            state.login.error = false;
        },
    }
});

export const {loginStart, loginSuccess, loginFailure, setToken, removeToken} = authSlice.actions;

export default authSlice.reducer;