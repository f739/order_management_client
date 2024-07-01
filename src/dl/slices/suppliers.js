import { createSlice } from "@reduxjs/toolkit";
import { suppliersApi } from "../api/suppliersApi";

const initialState = {
    allSuppliers: [],
    isLoading: false,
}

export const slice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        
        },
        extraReducers: builder => {
          builder.addMatcher(
            suppliersApi.endpoints.getSuppliers.matchFulfilled,
            (state, action) => {
            state.allSuppliers = action.payload;
          });
          builder.addMatcher(
            suppliersApi.endpoints.createNewSupplier.matchFulfilled, (state, action) => {
            state.allSuppliers.push(action.payload.newSupplier) 
          });
          builder.addMatcher(
            suppliersApi.endpoints.removeSupplier.matchFulfilled, (state, action) => {
            state.allSuppliers = state.allSuppliers.filter( el => el._id !== action.payload._id);
          });
          builder.addMatcher(
            suppliersApi.endpoints.editSupplier.matchFulfilled, (state, action) => {
              state.allSuppliers = state.allSuppliers
              .map( el => el._id !== action.payload._id ? el : action.payload)
          });
        }
    })
    
    
export const actions = slice.actions;
export default slice.reducer;

