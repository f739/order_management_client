import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';

export const getMeasures = createAsyncThunk('measures/getMeasures', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.get(`${URL}/measures/getAllMeasures`);
        return res.data.allMeasures
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const createNewMeasure = createAsyncThunk('measures/createNewMeasure', 
  async (newMeasure, {rejectWithValue}) => {  
      try {
        const res = await $.post(`${URL}/measures/newMeasure`, newMeasure);
        return res.data.newMeasure;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const removeMeasure = createAsyncThunk('measures/removeMeasure', 
  async (_id, {getState, rejectWithValue}) => {  
      try {
        const res = await $.delete(`${URL}/measures/${_id}/deleteMeasure`);
        if (res) {
            const updatedMeasure = getState().measures.allMeasures
            .filter( el => el._id !== _id);
            return updatedMeasure;
        }
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);


const initialState = {
    allMeasures: [],
    errorMessage: null
}

export const slice = createSlice({
    name: 'measures',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(getMeasures.fulfilled, (state, action) => {
              state.allMeasures = action.payload;
              state.errorMessage = '';
          })
          builder.addCase(getMeasures.rejected, (state, action) => {
              state.errorMessage = action.payload;
          })
          builder.addCase(createNewMeasure.fulfilled, (state, action) => {
            state.allMeasures.push(action.payload);
            state.errorMessage = ''
          })
          builder.addCase(createNewMeasure.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
          builder.addCase(removeMeasure.fulfilled, (state, action) => {
            state.allMeasures = action.payload;
            state.errorMessage = ''
          })
          builder.addCase(removeMeasure.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
