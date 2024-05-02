import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';

export const getUsers = createAsyncThunk('users/getUsers', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.put(`${URL}/users/getUsers`);
        const { allUsers } = res.data;
        return allUsers
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const createNewUser = createAsyncThunk('users/createNewUser', 
  async (formCreateUser, {rejectWithValue}) => {  
      try {
        const res = await $.post(`${URL}/users/createNewUser`, formCreateUser);
        return res.data.newUser;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const removeUser = createAsyncThunk('users/removeUser', 
  async (_id, {getState, rejectWithValue}) => {  
      try {
        const res = await $.delete(`${URL}/users/${_id}/deleteUser`);
        if (res) {
            const updatedusers = getState().users.allUsers
            .filter( el => el._id !== _id);
            return updatedusers;
        }
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);


export const connectUser = createAsyncThunk('users/connectUser', 
  async ({email, password}, {rejectWithValue}) => {  
      try {
        const res = await $.put(`${URL}/login/${password}/${email}/connectUser`);
        const {license, factory, userName, token} = res.data.user;
        localStorage.setItem('token', token);
        return { license, factory, userName, email}
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);
export const testToken = createAsyncThunk('users/testToken', 
  async (_, {rejectWithValue}) => {  
    const token = localStorage.getItem('token');
      try {
        const res = await $.put(`${URL}/login/${token}/testToken`);
        const {license, factory, userName, email} = res.data.user;
        const newToken = res.data.user.token;
        if (token !== newToken) {
          localStorage.setItem('token', newToken);
        }
        return { license, factory, userName, email}
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

const initialState = {
    allUsers: [],
    user: {email: '', license: '', userName: '',factory: '' },
    isLoading: false,
    isLoadingToken: false
}

export const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
            builder.addCase(getUsers.pending, (state, action) => {
                state.isLoading = true;
            })
            builder.addCase(getUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload;
                state.isLoading = false
            })
            builder.addCase(createNewUser.fulfilled, (state, action) => {
                state.allUsers.push(action.payload);
            })
            builder.addCase(removeUser.fulfilled, (state, action) => {
                state.allUsers = action.payload;
            })
            builder.addCase(connectUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            builder.addCase(testToken.pending, (state, action) => {
                state.isLoadingToken = true;
            })
            builder.addCase(testToken.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoadingToken = false;
            })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
