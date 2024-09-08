import { createSlice } from "@reduxjs/toolkit";
import { usersApi } from "../api/usersApi";
import { mainApi } from "../api/mainApi";
import { logOut, updateUserInfo } from "./auth";

const initialState = {
  allUsers: [],
  user: {
    ifVerifiedEmail: false,
    _id: '',
    email: '',
    userName: '',
    branch: '',
    company: '',
    role: 'guest'
  },
}

export const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        
        },
        extraReducers: builder => {
            builder.addCase(updateUserInfo, (state, action) => {
              const { role, email, company, _id, userName, ifVerifiedEmail, branch } = action.payload;
              Object.assign(state.user, { role, _id, branch, email, company, userName, ifVerifiedEmail });
            });
            builder.addCase(logOut, (state, action) => {
              state.user = initialState.user;
            });
            builder.addMatcher(
              mainApi.endpoints.resetPassword.matchFulfilled, (state, action) => {
                const { role, email, company, _id, ifVerifiedEmail, token, tokenCompany } = action.payload.userUpdated;
                Object.assign(state.user, { role, _id, email, company, ifVerifiedEmail });
                localStorage.setItem('tokenCompany', tokenCompany);
                localStorage.setItem('userToken', token);
            });
            builder.addMatcher(
              usersApi.endpoints.getUsers.matchFulfilled,
              (state, action) => {
              state.allUsers = action.payload;
            });
            builder.addMatcher(
              usersApi.endpoints.createNewUser.matchFulfilled, (state, action) => {
              state.allUsers.push(action.payload.newUser) 
            });
            builder.addMatcher(
              usersApi.endpoints.removeUser.matchFulfilled, (state, action) => {
              state.allUsers = state.allUsers.filter( el => el._id !== action.payload._id);
            });
            builder.addMatcher( mainApi.endpoints.connectUser.matchFulfilled, (state, action) => {
              const { token, ifVerifiedEmail, tokenCompany } = action.payload.user;
                
                localStorage.setItem('tokenCompany', tokenCompany);
                localStorage.setItem('userToken', token);
                localStorage.setItem('ifVerifiedEmail', ifVerifiedEmail);
                state.user = {...action.payload.user};
              }
            );
            builder.addMatcher(
              mainApi.endpoints.createNewCompany.matchFulfilled, (state, action) => {
                const { tokenCompany, newUser } = action.payload;
                state.user = {...newUser};
                
                localStorage.setItem('tokenCompany', tokenCompany);
                localStorage.setItem('userToken', newUser.token);
              });
            builder.addMatcher(
              mainApi.endpoints.verifyEmailAndUpdatePass.matchFulfilled, (state, action) => {
                state.user.ifVerifiedEmail = true;
                localStorage.setItem('ifVerifiedEmail', true);
            });
            builder.addMatcher(
              mainApi.endpoints.editUserDetails.matchFulfilled, (state, action) => {
                const { user } = action.payload;
                state.user.email = user.email;
                state.user.userName = user.userName;
                state.user.ifVerifiedEmail = false;
                
                localStorage.removeItem('ifVerifiedEmail');
                localStorage.setItem('userToken', user.token);
            });
            }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
