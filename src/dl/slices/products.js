import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendAnInvitation, getActiveOrders } from './orders';
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';

export const getProducts = createAsyncThunk('products/getProducts', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.put(`${URL}/products/getAllProducts`);
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

export const editProduct = createAsyncThunk('products/editProduct', 
  async (productUpdated, {getState, rejectWithValue}) => {  
    console.log(productUpdated);
      try {
        const res = await $.put(`${URL}/products/editProduct`, productUpdated);
        const newProduct = res.data.newProduct;
        const updatedProduct = getState().products.allProducts
        .map( el => el._id !== newProduct._id ? el : newProduct)
        return updatedProduct;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const addOrSubtract = createAsyncThunk('products/addOrSubtract', 
  async ({_id, newTemporaryQuantity}, {getState, rejectWithValue}) => {  
      try {
        await $.put(`${URL}/orders/${newTemporaryQuantity}/${_id}/changeQuantity`);
        const updatedProducts = getState().products.allProducts.map( product => {
          if (product._id === _id) {
            return {...product, temporaryQuantity: newTemporaryQuantity};
          }
          return product;
        });
        return updatedProducts;
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const addPrice = createAsyncThunk('products/addPrice', 
  async ({ price, _idSupplier, _idProduct}, {getState, dispatch, rejectWithValue}) => {  
      try {
        const res = await $.put(`${URL}/products/${_idSupplier}/${price}/${_idProduct}/addPrice`);
        dispatch( getActiveOrders())
        const updatedProducts = getState().products.allProducts.map( product => {
          if (product._id === _idProduct) {
            return {...product, price: res.data.updateProduct.price};
          }
          return product;
        });
        return updatedProducts
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);


const initialState = {
    allProducts: [],
    isLoading: false 
}

export const slice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(addPrice.fulfilled, (state, action) => {
              state.allProducts = action.payload;
          })
          builder.addCase(getProducts.pending, (state, action) => {
            state.isLoading = true;
          })
          builder.addCase(getProducts.fulfilled, (state, action) => {
              state.allProducts = action.payload;
              state.isLoading = false
          })
          builder.addCase(createNewProduct.fulfilled, (state, action) => {
            state.allProducts.push(action.payload);
          })
          builder.addCase(removeProduct.fulfilled, (state, action) => {
            state.allProducts = action.payload;
          })
          builder.addCase(editProduct.fulfilled, (state, action) => {
            state.allProducts = action.payload;
          })
          builder.addCase(addOrSubtract.fulfilled, (state, action) => {
            state.allProducts = action.payload;
          })
          builder.addCase(sendAnInvitation.fulfilled, (state, action) => {
            state.allProducts = action.payload.allProducts;
        })

        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
