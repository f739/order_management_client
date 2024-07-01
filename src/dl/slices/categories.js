import { createSlice } from "@reduxjs/toolkit";
import { categoriesApi } from "../api/categoriesApi";

const initialState = {
  allCategories: [],
}

export const slice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
      
      },
      extraReducers: builder => {
        builder.addMatcher(
          categoriesApi.endpoints.getCategories.matchFulfilled,
          (state, action) => {
          state.allCategories = action.payload;
        });
        builder.addMatcher(
          categoriesApi.endpoints.createNewCategory.matchFulfilled, (state, action) => {
          state.allCategories.push(action.payload.newCategory) 
        });
        builder.addMatcher(
          categoriesApi.endpoints.removeCategory.matchFulfilled, (state, action) => {
          state.allCategories = state.allCategories.filter( el => el._id !== action.payload._id);
        });
      }
  })

export const actions = slice.actions;
export default slice.reducer;