import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../services/service";
import $ from 'axios';

export const getSuppliers = createAsyncThunk('suppliers/getSuppliers', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.get(`${URL}/suppliers/getAllsuppliers`);
        return res.data.allSuppliers
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const createNewSupplier = createAsyncThunk('suppliers/createNewSupplier', 
  async (newSupplier, {rejectWithValue}) => {  
      try {
        const res = await $.post(`${URL}/suppliers/newSupplier`, newSupplier);
        return res.data.newSupplier;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const removeSupplier = createAsyncThunk('suppliers/removeSupplier', 
  async (_id, {getState, rejectWithValue}) => {  
      try {
        const res = await $.delete(`${URL}/suppliers/${_id}/deleteSupplier`);
        if (res) {
            const updatedSuppliers = getState().suppliers.allSuppliers
            .filter( el => el._id !== _id);
            return updatedSuppliers;
        }
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);


const initialState = {
    allSuppliers: [],
    errorMessage: null
}

export const slice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(getSuppliers.fulfilled, (state, action) => {
              state.allSuppliers = action.payload;
              state.errorMessage = '';
          })
          builder.addCase(getSuppliers.rejected, (state, action) => {
              state.errorMessage = action.payload;
          })
          builder.addCase(createNewSupplier.fulfilled, (state, action) => {
            state.allSuppliers.push(action.payload);
            state.errorMessage = ''
          })
          builder.addCase(createNewSupplier.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
          builder.addCase(removeSupplier.fulfilled, (state, action) => {
            state.allSuppliers = action.payload;
            state.errorMessage = ''
          })
          builder.addCase(removeSupplier.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
