import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendAnInvitation } from './orders';
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

export const createNewNote = createAsyncThunk('products/createNewNote', 
  async ({_id, newNote}, {getState, rejectWithValue}) => {  
      try {
        const res = await $.put(`${URL}/orders/${_id}/${newNote}/createNewNote`);
        if (res.data.newNote) {
          const updatedProducts = getState().products.allProducts.map( product => {
            if (product._id === _id) {
              return {...product, note: newNote};
            }
            return product;
          });
          return updatedProducts;
      }
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const removeNote = createAsyncThunk('products/removeNote', 
  async (_id, {getState, rejectWithValue}) => {  
      try {
        await $.delete(`${URL}/orders/${_id}/deleteNote`);
          const updatedProducts = getState().products.allProducts.map( product => {
            if (product._id === _id) {
              return {...product, note: ''};
            }
            return product;
          });
          return updatedProducts;
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
  async ({nameSupplier, price, _idProduct}, {getState, rejectWithValue}) => {  
      try {
        const res = await $.put(`${URL}/products/${nameSupplier}/${price}/${_idProduct}/addPrice`);
        const updatedProducts = getState().products.allProducts.map( product => {
          if (product._id === _idProduct) {
            return res.data.updateProduct;
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
          builder.addCase(createNewNote.fulfilled, (state, action) => {
            state.allProducts = action.payload;
          })
          builder.addCase(removeNote.fulfilled, (state, action) => {
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
