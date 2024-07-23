import { createSlice } from "@reduxjs/toolkit";
import { productsApi } from "../api/productsApi";


const initialState = {
  newPrice: { _idSupplier: '', price: '' },

}

export const slice = createSlice({
  name: 'prices',
  initialState,
  reducers: {
      updatedPrice(state, action) {
        const { name, value } = action.payload;
        state.newPrice = {...state.newPrice, [name]: value};
      },
  },
  extraReducers: builder => {
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
