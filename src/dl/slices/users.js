import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../services/service";
import $ from 'axios';


export const getUsers = createAsyncThunk('users/getUsers', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.get(`${URL}/users/getUsers`);
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
        const { token, license } = res.data.user;
        localStorage.setItem('token', token);
        return {email, license}
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);
export const testToken = createAsyncThunk('users/testToken', 
  async (token, {rejectWithValue}) => {  
      try {
        const res = await $.get(`${URL}/login/${token}/testToken`);
        return res.data.license;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

const initialState = {
    allUsers: [],
    user: {email: '', license: '' },
    errorMessage: ''
}

export const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
            builder.addCase(getUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload;
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
            builder.addCase(testToken.fulfilled, (state, action) => {
                state.user.license = action.payload;
            })
            builder.addCase(connectUser.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
