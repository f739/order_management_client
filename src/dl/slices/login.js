import { createSlice } from "@reduxjs/toolkit";

const initialState = {

}

export const slice = createSlice({
    name: 'login', 
    initialState,
    reducers: {
        logOut( state, action) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('tokenCompany');
        },
        updateUserInfo( state, action) {
            return action.payload;
        },

    }
})

export const { updateUserInfo, logOut } = slice.actions;
export const actions = slice.actions;
export default slice.reducer;