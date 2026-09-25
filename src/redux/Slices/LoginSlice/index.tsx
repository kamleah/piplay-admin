import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogged: false,
    roleIs: "",
    loggedUserDetails: {},
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLoggedUser: (state, action) => {
            state.isLogged = action.payload;
        },
        setRoleIs: (state, action) => {
            state.roleIs = action.payload;
        },
        setLoggedUserDetails: (state, action) => {
            state.loggedUserDetails = action.payload;
        }
    }
});

export const { setLoggedUser, setRoleIs, setLoggedUserDetails } = loginSlice.actions;

export default loginSlice.reducer;
