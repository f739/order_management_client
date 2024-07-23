import { createSlice } from "@reduxjs/toolkit";
import { productsApi } from "../api/productsApi";
import { ordersApi } from "../api/ordersApi";
import { mainApi } from "../api/mainApi";

const initialState = {
  allProducts: [],
  newPrice: { _idSupplier: '', price: '' },
  newProduct: { 
    nameProduct: '',
    category: '',
    unitOfMeasure: '',
    sku: '',
    branches: [],
    price: [], 
  },
  errorNewPrice: ''
}

export const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updatedPrice(state, action) {
      const { name, value } = action.payload;
      state.newPrice = {...state.newPrice, [name]: value};
    },
    updatedProduct(state, action) {
      const { name, value } = action.payload;
      state.newProduct = {...state.newProduct, [name]: value};
    },
    cleanNewProduct(state, action) {
      state.newProduct = { nameProduct: '', branches: [], category: '', unitOfMeasure: '', sku: '', price: [] };
    },
    saveNewPrice(state, action) {
      const {newPrice, newProduct} = state;
      if (newPrice._idSupplier === '' || newPrice.price === '' || !/^\d*\.?\d+$/.test(newPrice.price)) {
        state.errorNewPrice = 'שדות אינם תקינים'
        return
      };
      if (newProduct.price.some(prod => prod._idSupplier === newPrice._idSupplier)) {
        state.errorNewPrice = 'יצרת מחיר עבור הספק';
        return
      };
      state.newProduct = {
        ...newProduct,
        price: [...newProduct.price, newPrice]
      };
      state.newPrice = { _idSupplier: '', price: '' };
    },
    deletePriceFromNewProduct(state, action) {
      const placeDelete = action.payload;
      const newPriceArray = [...state.newProduct.price];
      newPriceArray.splice(placeDelete, 1);
      state.newProduct = {...state.newProduct, price: newPriceArray};
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      mainApi.endpoints.getProducts.matchFulfilled,
      (state, action) => {
      state.allProducts = action.payload;
    });
    // builder.addMatcher(
    //   productsApi.endpoints.createNewProduct.matchFulfilled, (state, action) => {
    //     state.allProducts.push(action.payload) 
    //   });
    builder.addMatcher(
      mainApi.endpoints.removeProduct.matchFulfilled, (state, action) => {
        state.allProducts = state.allProducts.filter( el => el._id !== action.payload._id);
      });
    builder.addMatcher(
      mainApi.endpoints.sendAnInvitation.matchFulfilled,
      (state, action) => {
      state.allProducts = action.payload.allProducts;
    });
    builder.addMatcher(
      mainApi.endpoints.editProduct.matchFulfilled, (state, action) => {
        const { newProduct } = action.payload;
        state.allProducts = state.allProducts
        .map( el => el._id !== newProduct._id ? el : newProduct)
    });
    builder.addMatcher(
      mainApi.endpoints.addPrice.matchFulfilled, (state, action) => {
        // const { _id, price } = action.payload;
        console.log(action.payload);
        // if (state.allProducts.length === 0) {
        //   return state.allProducts.push(action.payload)
        // }
        // state.allProducts = state.allProducts.map( product => {
        //     if (product._id === _id) {
        //       return {...product, price: price};
        //     }
        //     return product;
        // });
    });
  }
})
    
export const actions = slice.actions;
export default slice.reducer;
