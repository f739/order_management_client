import { createSlice } from "@reduxjs/toolkit";
import { usersApi } from "../api/usersApi";
import { mainApi } from "../api/mainApi";
import { logOut, updateUserInfo } from "./auth";

const initialState = {
  allUsers: [],
  user: {
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
              const { role, email, company, _id, userName, branch } = action.payload;
              Object.assign(state.user, { role, _id, branch, email, company, userName });
            });
            builder.addCase(logOut, (state, action) => {
              state.user = initialState.user;
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
              const { token, tokenCompany } = action.payload.user;
                
                localStorage.setItem('tokenCompany', tokenCompany);
                localStorage.setItem('userToken', token);
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
                const { tokenCompany, token } = action.payload;
                console.log(tokenCompany, token);
                localStorage.setItem('tokenCompany', tokenCompany);
                localStorage.setItem('userToken', token);
            });
            builder.addMatcher(
              mainApi.endpoints.editUserDetails.matchFulfilled, (state, action) => {
                const { userUpdated, newToken } = action.payload;
                const { role, _id, branch, email, company, userName } = userUpdated;

                Object.assign(state.user, { role, _id, branch, email, company, userName });
                localStorage.setItem('userToken', newToken);
            });
            }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
