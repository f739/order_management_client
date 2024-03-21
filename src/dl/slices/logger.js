import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../services/service";
import $ from 'axios';

export const getAllErrorsLog = createAsyncThunk('logger/getAllErrorsLog', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.get(`${URL}/loggerRoute/getAllErrorsLog`);
        return res.data.allLogger
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
}

export const slice = createSlice({
    name: 'logger',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(getAllErrorsLog.fulfilled, (state, action) => {
              state.allLogger = action.payload;
          })
          builder.addCase(clearLogger.fulfilled, (state, action) => {
            state.allLogger = action.payload;
          })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
