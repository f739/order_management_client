import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';

export const getSuppliers = createAsyncThunk('suppliers/getSuppliers', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.put(`${URL}/suppliers/getAllsuppliers`);
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
    isLoading: false,
}

export const slice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(getSuppliers.pending, (state, action) => {
            state.isLoading = true;
            state.allSuppliers = action.payload;
          })
          builder.addCase(getSuppliers.fulfilled, (state, action) => {
              state.allSuppliers = action.payload;
              state.isLoading = false;
          })
          builder.addCase(createNewSupplier.fulfilled, (state, action) => {
            state.allSuppliers.push(action.payload);
          })
          builder.addCase(removeSupplier.fulfilled, (state, action) => {
            state.allSuppliers = action.payload;
          })

        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
