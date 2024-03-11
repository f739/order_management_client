import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../services/service";
import $ from 'axios';

export const getProducts = createAsyncThunk('products/getProducts', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.get(`${URL}/products/getAllProducts`);
        return res.data.allProducts
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const createNewProduct = createAsyncThunk('products/createNewProduct', 
  async (newProduct, {rejectWithValue}) => {  
      try {
        const res = await $.post(`${URL}/products/newProduct`, newProduct);
        return res.data.newProduct;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const removeProduct = createAsyncThunk('products/removeProduct', 
  async (_id, {getState, rejectWithValue}) => {  
      try {
        const res = await $.delete(`${URL}/products/${_id}/deleteProduct`);
        if (res) {
            const updatedProducts = getState().products.allProducts
            .filter( el => el._id !== _id);
            return updatedProducts;
        }
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);


const initialState = {
    allProducts: [],
    errorMessage: null
}

export const slice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(getProducts.fulfilled, (state, action) => {
              state.allProducts = action.payload;
              state.errorMessage = '';
          })
          builder.addCase(getProducts.rejected, (state, action) => {
              state.errorMessage = action.payload;
          })
          builder.addCase(createNewProduct.fulfilled, (state, action) => {
            state.allProducts.push(action.payload);
            state.errorMessage = ''
          })
          builder.addCase(createNewProduct.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
          builder.addCase(removeProduct.fulfilled, (state, action) => {
            state.allProducts = action.payload;
            state.errorMessage = ''
          })
          builder.addCase(removeProduct.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
