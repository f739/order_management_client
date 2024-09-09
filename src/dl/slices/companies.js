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
        builder.addMatcher(
          mainApi.endpoints.buyLicense.matchFulfilled, (state, action) => {
            const { newToken } = action.payload;
            
            localStorage.setItem('tokenCompany', newToken)
          }

        )
      }
  })

export const actions = slice.actions;
export default slice.reducer;