import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = import.meta.env.VITE_API_URL
import $ from "axios";

export const sendAnInvitation = createAsyncThunk("orders/sendAnInvitation",
  async ({user, whichFactoryToSend}, { getState, rejectWithValue }) => {
    try {
      const res = await $.post(`${URL}/orders/sendAnInvitation`, {user, whichFactoryToSend});
      const { newActiveOrder, allProducts } = res.data;
      return { allProducts, newActiveOrder };
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getActiveOrders = createAsyncThunk( "orders/getActiveOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await $.put(`${URL}/orderManagement/getAllActiveOrders`);
      return res.data.allActiveOrders;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getOldOrders = createAsyncThunk("orders/getOldOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await $.put(`${URL}/oldOrders/getOldOrders`);
      return res.data.oldOrders;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const newOrderToDeliver = createAsyncThunk( "orders/newOrderToDeliver",
  async ({emailForm, whichFactoryToSend}, { rejectWithValue }) => {
    try {
      const res = await $.post( `${URL}/orderManagement/newOrderToDeliver`, {emailForm, whichFactoryToSend} );
      const { newOldOrder, activeOrders } = res.data;
      const activesDeletedEmpty = activeOrders.filter( arr => arr.listProducts.length > 0);
      return { newOldOrder, activesDeletedEmpty };
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const removeProduct = createAsyncThunk("orders/removeProduct",
  async ({ _id, idInvitation }, { getState, rejectWithValue }) => {
    try {
      await $.put( `${URL}/orderManagement/${_id}/${idInvitation}/removeProduct` );
      return { _id, idInvitation };
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const removeProductInOldOrder = createAsyncThunk("orders/removeProductInOldOrder",
  async ({ _id, idOrderList }, { rejectWithValue }) => {
    try {
      const res = await $.put( `${URL}/oldOrders/${_id}/${idOrderList}/removeProductInOldOrder` );
      return res.data.doc;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const returnProduct = createAsyncThunk("orders/returnProduct",
  async (data, { getState, rejectWithValue }) => {
    try {
      const res = await $.post(`${URL}/oldOrders/returnProduct`, {...data});
      const { newActiveOrder } = res.data;
      const updatedOrders = getState().orders.allOldOrders.map(order => {
        const filteredProducts = order.orderList.filter(product => product._id !== data._id);
        return {
          ...order,
          orderList: filteredProducts
        };
      });
      return {newActiveOrder, updatedOrders};
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const productReceivedAction = createAsyncThunk("orders/productReceivedAction",
  async (productData, { rejectWithValue }) => {
    try {
      const res = await $.put(`${URL}/oldOrders/productReceived`, productData);
      return res.data.allOldOrders;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const initialState = {
  allActiveOrders: [],
  allOldOrders: [],
};

export const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(returnProduct.fulfilled, (state, action) => {
      state.allActiveOrders.push(action.payload.newActiveOrder);
      const filteredEmptyArrays = action.payload.updatedOrders
      .filter(oldOrder => oldOrder.orderList.length > 0);
      state.allOldOrders = filteredEmptyArrays; 
    });
    builder.addCase(sendAnInvitation.fulfilled, (state, action) => {
      state.allActiveOrders.push(action.payload.newActiveOrder);
    });
    builder.addCase(getActiveOrders.fulfilled, (state, action) => {
      state.allActiveOrders = action.payload;
    });
    builder.addCase(getOldOrders.fulfilled, (state, action) => {
      state.allOldOrders = action.payload;
    });
    builder.addCase(newOrderToDeliver.fulfilled, (state, action) => {
      state.allOldOrders.push(action.payload.newOldOrder);
      state.allActiveOrders = action.payload.activesDeletedEmpty;
    });
    builder.addCase(removeProductInOldOrder.fulfilled, (state, action) => {
      const updatedDoc = state.allOldOrders.map(oldOrder => {
        return action.payload._id === oldOrder._id ? action.payload : oldOrder;
      });

      const filteredOrders = updatedDoc.filter(oldOrder => oldOrder.orderList.length > 0);
      state.allOldOrders = filteredOrders; 
    });
    builder.addCase(productReceivedAction.fulfilled, (state, action) => {
      state.allOldOrders = action.payload;
      // update OrdersReceivedSchema...
    });
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      const { _id, idInvitation } = action.payload;
      const orderIndex = state.allActiveOrders.findIndex(
        (order) => order._id === idInvitation
      );
      if (orderIndex !== -1) {
        state.allActiveOrders[orderIndex].listProducts = state.allActiveOrders[
          orderIndex
        ].listProducts.filter((product) => product._id !== _id);
        if (state.allActiveOrders[orderIndex].listProducts.length === 0) {
          state.allActiveOrders.splice(orderIndex, 1);
        }
      }
    });
  },
});

export const actions = slice.actions;
export default slice.reducer;

// export const sendEmail = slice.actions.sendEmail;
