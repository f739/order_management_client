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
              const { role, email, company, _id, ifVerifiedEmail } = action.payload;
              Object.assign(state.user, { role, _id, email, company, ifVerifiedEmail });
            });
            builder.addCase(logOut, (state, action) => {
              state.user.role = 'guest';
              state.user.email = '';
              state.user.company = '';
              state.user.ifVerifiedEmail = false;
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
              // builder.addMatcher(
              //   usersApi.endpoints.testToken.matchFulfilled,
              //   (state, action) => {
              //     const {license, branch, userName, email, token} = action.payload;
              //     action.meta.arg.originalArgs !== token ? localStorage.setItem('token', token) : null;
              //     state.user = {license, branch, userName, email}
              //   });
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
            }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
