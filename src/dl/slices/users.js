import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersApi } from "../api/usersApi";

const initialState = {
  allUsers: [],
  user: {
  _id: '',
  email: '',
  license: '',
  userName: '',
  factory: '',
  isAdmin: false,
  isSubscriber: false,
  role: 'guest'
  },
}

export const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        
        },
        extraReducers: builder => {
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
            builder.addMatcher(
              usersApi.endpoints.connectUser.matchFulfilled,
              (state, action) => {
                const {license, factory, userName, email, token} = action.payload;
                localStorage.setItem('token', token);
                state.user = {license, factory, userName, email}
            });
            builder.addMatcher(
              usersApi.endpoints.testToken.matchFulfilled,
              (state, action) => {
                const {license, factory, userName, email, token} = action.payload;
                action.meta.arg.originalArgs !== token ? localStorage.setItem('token', token) : null;
                state.user = {license, factory, userName, email}
            });
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
