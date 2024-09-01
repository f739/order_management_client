import { createSlice } from "@reduxjs/toolkit";
import { mainApi } from "../api/mainApi";

const initialState = {
    allSuppliers: [],
    isLoading: false,
}

export const slice = createSlice({
    name: 'userSettings',
    initialState,
    reducers: {
        
        },
        extraReducers: builder => {
          builder.addMatcher(
            mainApi.endpoints.editUserDetails.matchFulfilled,
            (state, action) => {
                
          });
        }
    })
    
    
export const actions = slice.actions;
export default slice.reducer;

