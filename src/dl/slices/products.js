import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = import.meta.env.VITE_API_URL
import $ from 'axios';
import { productsApi } from "../api/productsApi";
import { ordersApi } from "../api/ordersApi";

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

// export const addPrice = createAsyncThunk('products/addPrice', 
//   async ({ price, _idSupplier, _idProduct}, {getState, dispatch, rejectWithValue}) => {  
//       try {
//         const res = await $.put(`${URL}/products/${_idSupplier}/${price}/${_idProduct}/addPrice`);
//         dispatch( getActiveOrders())
//         const updatedProducts = getState().products.allProducts.map( product => {
//           if (product._id === _idProduct) {
//             return {...product, price: res.data.updateProduct.price};
//           }
//           return product;
//         });
//         return updatedProducts
//       }catch (err) {
//         return rejectWithValue(err.response.data.message)
//       }
//   }
// );


const initialState = {
  allProducts: [],
}

export const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {
      
  },
  extraReducers: builder => {
    builder.addMatcher(
      productsApi.endpoints.getProducts.matchFulfilled,
      (state, action) => {
      state.allProducts = action.payload;
    });
    builder.addMatcher(
      productsApi.endpoints.createNewProduct.matchFulfilled, (state, action) => {
        state.allProducts.push(action.payload) 
      });
    builder.addMatcher(
      productsApi.endpoints.removeProduct.matchFulfilled, (state, action) => {
        state.allProducts = state.allProducts.filter( el => el._id !== action.payload._id);
      });
    builder.addMatcher(
      ordersApi.endpoints.sendAnInvitation.matchFulfilled,
      (state, action) => {
      state.allProducts = action.payload.allProducts;
    });
    builder.addMatcher(
      productsApi.endpoints.editProduct.matchFulfilled, (state, action) => {
        state.allProducts = state.allProducts
        .map( el => el._id !== action.payload._id ? el : action.payload)
    });
    builder.addMatcher(
      productsApi.endpoints.addPrice.matchFulfilled, (state, action) => {
        const { _id, price } = action.payload;
        if (state.allProducts.length === 0) {
          return state.allProducts.push(action.payload)
        }
        state.allProducts = state.allProducts.map( product => {
            if (product._id === _id) {
              return {...product, price: price};
            }
            return product;
          });
    });
  }
})
    
export const actions = slice.actions;
export default slice.reducer;
