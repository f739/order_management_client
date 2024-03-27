import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';

export const getAllErrorsLog = createAsyncThunk('logger/getAllErrorsLog', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.put(`${URL}/loggerRoute/getAllErrorsLog`);
        return res.data.allLogger;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const clearLogger = createAsyncThunk('logger/clearLogger', 
  async (_, {rejectWithValue}) => {  
      try {
        await $.delete(`${URL}/loggerRoute/clearLogger`);
        return []
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);


const initialState = {
    allLogger: [],
    isLoading: false,
}

export const slice = createSlice({
    name: 'logger',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(getAllErrorsLog.pending, (state, action) => {
            state.isLoading = true;
            state.allLogger = action.payload;
          })
          builder.addCase(getAllErrorsLog.fulfilled, (state, action) => {
              state.allLogger = action.payload;
              state.isLoading = false;
          })
          builder.addCase(clearLogger.fulfilled, (state, action) => {
            state.allLogger = action.payload;
          })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
