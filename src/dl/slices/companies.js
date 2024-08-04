import { createSlice } from "@reduxjs/toolkit";
import { mainApi } from "../api/mainApi";


const initialState = {
  
}

export const slice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
      
      },
      extraReducers: builder => {
        
      }
  })

export const actions = slice.actions;
export default slice.reducer;