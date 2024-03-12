import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { URL } from "../../services/service";
import $ from 'axios';


export const sendAnInvitation = createAsyncThunk('orders/sendAnInvitation', 
  async (_, {getState, rejectWithValue}) => {  
      try {
        const res = await $.post(`${URL}/orders/sendAnInvitation`,{});
        const resetQuantityProducts = getState().products.allProducts
        .map( product => {
          if (product.temporaryQuantity > 0) {
            return {...product, temporaryQuantity: 0};
          }
          return product;
        });
        const { newActiveOrder } = res.data;
        return {resetQuantityProducts, newActiveOrder}
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const getActiveOrders = createAsyncThunk('orders/getActiveOrders', 
  async (_, {rejectWithValue}) => {  
      try {
        const res = await $.get(`${URL}/orderManagement/getAllActiveOrders`);
        return res.data.allActiveOrders
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const newOrderToDeliver = createAsyncThunk('orders/newOrderToDeliver', 
  async (emailForm, {rejectWithValue}) => {  
      try {
        const res = await $.post(`${URL}/orderManagement/newOrderToDeliver`, emailForm);
        const {newOldOrder, activeOrders} = res.data;  
        console.log(activeOrders);
        return {newOldOrder, activeOrders};
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

export const removeProduct = createAsyncThunk('orders/removeProduct', 
  async ({_id, idInvitation}, {getState, rejectWithValue}) => {  
      try {
        await $.put(`${URL}/orderManagement/${_id}/${idInvitation}/removeProduct`);
        return {_id, idInvitation};
      }catch (err) {
        return rejectWithValue(err.response.data.message)
      }
  }
);

const initialState = {
    allActiveOrders: [],
    allOldOrders: [],
    errorMessage: null
}

export const slice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        
        },
        extraReducers: (builder) => {
          builder.addCase(sendAnInvitation.fulfilled, (state, action) => {
            console.log(action.payload.newActiveOrder);
            state.allActiveOrders.push( action.payload.newActiveOrder);
          })
          builder.addCase(sendAnInvitation.rejected, (state, action) => {
            state.errorMessage = action.payload;
          })
          builder.addCase(getActiveOrders.fulfilled, (state, action) => {
            state.allActiveOrders = action.payload;
          })
          builder.addCase(newOrderToDeliver.fulfilled, (state, action) => {
            state.allOldOrders.push(action.payload.newOldOrder);
            state.allActiveOrders = action.payload.activeOrders;
          })
          builder.addCase(removeProduct.fulfilled, (state, action) => {
            const { _id, idInvitation} = action.payload;
            const orderIndex = state.allActiveOrders.findIndex(order => order._id === idInvitation);
            if (orderIndex !== -1) {
              state.allActiveOrders[orderIndex].listProducts = state.allActiveOrders[orderIndex].listProducts.filter(product => product._id !== _id);
              if (state.allActiveOrders[orderIndex].listProducts.length === 0) {
                state.allActiveOrders.splice(orderIndex, 1);
              }
            }
          })
        }
    })
    
    
    export const actions = slice.actions;
    export default slice.reducer;
    
    
// export const sendEmail = slice.actions.sendEmail;
