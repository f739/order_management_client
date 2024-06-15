import { createSlice } from "@reduxjs/toolkit";
import { oldOrdersApi } from '../api/oldOrdersApi';
import { ordersApi } from "../api/ordersApi";

const initialState = {
  allOldOrders: [],
};

export const slice = createSlice({
  name: "oldOrders",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      oldOrdersApi.endpoints.getOldOrders.matchFulfilled, (state, action) => {
      state.allOldOrders = action.payload;
    });
    builder.addMatcher(
      ordersApi.endpoints.sendOrderFromCart.matchFulfilled, (state, action) => {
        state.allOldOrders.push(action.payload.newOldOrder);
    });
    builder.addMatcher(
      oldOrdersApi.endpoints.returnProduct.matchFulfilled, (state, action) => {
        state.allOldOrders = state.allOldOrders.map(order => {
          const filteredProducts = order.orderList.filter(product => product._id !== action.payload._id);
          return {
            ...order,
            orderList: filteredProducts
          };
        });
    });
    builder.addMatcher(
      oldOrdersApi.endpoints.removeProductInOldOrder.matchFulfilled, (state, action) => {
        state.allOldOrders = state.allOldOrders.map(oldOrder => {
          return action.payload._id === oldOrder._id ? action.payload : oldOrder;
        });  
    });
    builder.addMatcher(
      oldOrdersApi.endpoints.productReceived.matchFulfilled, (state, action) => {
        state.allOldOrders = state.allOldOrders.map(oldOrder => {
          return action.payload._id === oldOrder._id ? action.payload : oldOrder;
        });  
    });

  },
});

export const actions = slice.actions;
export default slice.reducer;