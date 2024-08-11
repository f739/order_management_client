import { createSlice } from "@reduxjs/toolkit";
import { mainApi } from "../api/mainApi";

const initialState = {

}

export const slice = createSlice({
    name: 'auth', 
    initialState,
    reducers: {
        logOut( state, action) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('tokenCompany');
            localStorage.removeItem('ifVerifiedEmail');
        },
        updateUserInfo( state, action) {
            return action.payload;
        },
    },
    extraReducers: builder => {
        builder.addMatcher( mainApi.endpoints.resetPassword.matchFulfilled,
            (state, action) => {
                console.log(action.payload.userUpdated);
                localStorage.removeItem('ifVerifiedEmail');
                return action.payload;
        })
    }
})

export const { updateUserInfo, logOut } = slice.actions;
export const actions = slice.actions;
export default slice.reducer;