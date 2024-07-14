import { createSlice } from "@reduxjs/toolkit";
import { branchesApi } from "../api/branchesApi";

const initialState = {
  allBranches: [],
}

export const slice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
      
      },
      extraReducers: builder => {
        builder.addMatcher(
          branchesApi.endpoints.getBranches.matchFulfilled,
          (state, action) => {
          state.allBranches = action.payload;
        });
        builder.addMatcher(
          branchesApi.endpoints.createNewBranch.matchFulfilled, (state, action) => {
          state.allBranches.push(action.payload.newBranch) 
        });
        builder.addMatcher(
          branchesApi.endpoints.removeBranch.matchFulfilled, (state, action) => {
          state.allBranches = state.allBranches.filter( el => el._id !== action.payload._id);
        });
      }
  })

export const actions = slice.actions;
export default slice.reducer;