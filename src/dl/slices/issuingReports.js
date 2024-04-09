import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';

export const sendProductReport = createAsyncThunk('issuingReports/sendProductReport', 
  async (formToDeliver, {rejectWithValue}) => {  
    console.log(formToDeliver);
      try {
        const res = await $.post(`${URL}/issuingReports/sendProductReport`, formToDeliver);
        console.log(res.data.OrdersReceivedFilterd);
        console.log(res.data);
        return res.data
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

const initialState = {
    isLoading: false,
}

export const slice = createSlice({
    name: 'issuingReports',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
        //   builder.addCase(getCategories.pending, (state, action) => {
        //     state.isLoading = true;
        //     state.allCategories = action.payload;
        //   })
        //   builder.addCase(getCategories.fulfilled, (state, action) => {
        //       state.allCategories = action.payload;
        //       state.isLoading = false;
        //   })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
