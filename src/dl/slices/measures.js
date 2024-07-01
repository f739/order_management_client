import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { measuresApi } from "../api/measuresApi";

const initialState = {
    allMeasures: [],
}

export const slice = createSlice({
    name: 'measures',
    initialState,
    reducers: {
        
        },
        extraReducers: builder => {
          builder.addMatcher(
            measuresApi.endpoints.getMeasures.matchFulfilled,
            (state, action) => {
            state.allMeasures = action.payload;
          });
          builder.addMatcher(
            measuresApi.endpoints.createNewMeasure.matchFulfilled, (state, action) => {
            state.allMeasures.push(action.payload.newMeasure) 
          });
          builder.addMatcher(
            measuresApi.endpoints.removeMeasure.matchFulfilled, (state, action) => {
            state.allMeasures = state.allMeasures.filter( el => el._id !== action.payload._id);
          });
        }
    })
    
export const actions = slice.actions;
export default slice.reducer;
