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
        register:{
            currentUser: null,
            isFetching: false,
            error: false,
            success: false,
        }
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
        registerStart: (state) =>{
            state.register.isFetching = true;
        },
        registerSuccess: (state, action) =>{
            state.register.isFetching = false;
            state.register.currentUser = action.payload;
            state.register.error = false;
        },
        registerFailure: (state) =>{
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        }
    }
});

export const {loginStart, loginSuccess, loginFailure, setToken, removeToken, registerStart, registerSuccess, registerFailure} = authSlice.actions;

export default authSlice.reducer;
