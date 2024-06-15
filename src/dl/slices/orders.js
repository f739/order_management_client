import { createSlice } from "@reduxjs/toolkit";
import { ordersApi } from '../api/ordersApi';
import { oldOrdersApi } from "../api/oldOrdersApi";

const testIfSameFactory = (state, factory) => {
  return factory === state[0]?.factory || state.length === 0;
}
const removeItemFromCart = (state, _id) => {
  return state.filter( product => product._id !== _id);
}

const initialState = {
  allActiveOrders: [],
  cartToDeliver: [],
  cartToBookingManager: [],
  errorAddOrRemoveToCart: '',
  errorCartToBookingManager: {
    errorIncrease: '',
    errorChangeQuantity: '',

  }
};

export const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addToCart(state, action) {
      const {editQuantity, temporaryQuantity, ...newProduct} = action.payload;
      const ifSameFactory = testIfSameFactory(state.cartToDeliver, newProduct.factory);
       const ifsupplierExist = state.cartToDeliver[0]?._idSupplier === newProduct._idSupplier 
       || state.cartToDeliver.length === 0;

      if(newProduct.price.length === 0) {
        state.errorAddOrRemoveToCart = 'הגדר מחיר תחילה';
        return
      }else if (!ifSameFactory) {
        state.errorAddOrRemoveToCart = 'אין להכניס מוצרים המיועדים למפעל שונה';
      }else if (!ifsupplierExist) {
        state.errorAddOrRemoveToCart = 'ניסית לשים מוצרים מכמה ספקים שונים';
      } else {
        let totalQuantity = state.allActiveOrders.flatMap(order => order.listProducts)
          .filter(product => product._idProduct._id === newProduct._id)
          .reduce((acc, product) => acc + product.temporaryQuantity, 0);

        editQuantity !== temporaryQuantity ? totalQuantity = editQuantity : null;
        state.cartToDeliver.push({...newProduct, temporaryQuantity: totalQuantity});
        state.errorAddOrRemoveToCart = '';
      }
    },
    removeFromCart(state, action) {
      const _id = action.payload;
      state.cartToDeliver = state.cartToDeliver.filter( prod => prod._id !== _id);
      state.errorAddOrRemoveToCart = '';
    },
    editQuantity(state, action) {
      const {newQuantity, idProduct} = action.payload;
      state.cartToDeliver = state.cartToDeliver.map( prod => {
        return prod._id !== idProduct ? prod : {...prod, temporaryQuantity: newQuantity}
      })
    },
    changePrice(state, action) {
      const {idProduct, _idSupplier, price} = action.payload;
      state.cartToDeliver = state.cartToDeliver.map( prod => {
        return prod._id !== idProduct ? prod : {...prod, price, _idSupplier}
      })
    },
    ifSelectedChangeSupplier( state, action) {
      const {price, _idSupplier, _id} = action.payload;
      if (state.cartToDeliver.length === 0) return;
      state.cartToDeliver = state.cartToDeliver.map( prod => {
        return prod._id !== _id ? prod : {...prod, price, _idSupplier};
      })
    },
    increaseOne( state, action) {
      const { _id, factory} = action.payload;
      const ifSameFactory = testIfSameFactory(state.cartToBookingManager, factory);
      
      if (!ifSameFactory) {
        state.errorCartToBookingManager.errorIncrease = 'אין להכניס מוצרים ממפעל שונה';
        return
      }
      const productIndex = state.cartToBookingManager.findIndex(pr => pr._id === _id);
      if (productIndex !== -1) {
        state.cartToBookingManager = state.cartToBookingManager.map((pr, i) => {
          return i === productIndex ? { ...pr, quantity: pr.quantity + 1 } : pr;
        });
      } else {
        state.cartToBookingManager.push({...action.payload, quantity: 1})
      }
      state.errorCartToBookingManager.errorIncrease = '';
    },
    decreaseOne( state, action) {
      const _id = action.payload;
      const productIndex = state.cartToBookingManager.findIndex(pr => pr._id === _id);
      if (isNaN(productIndex)) return;
      state.cartToBookingManager = state.cartToBookingManager.map((pr, i) => {
        return i === productIndex && pr.quantity !== 0 ?
         { ...pr, quantity: pr.quantity - 1 } : pr;
      });
      
    },
    changeQuantityToBookingManager(state, action) {
      console.log(action.payload);
      const { _id, factory, quantity } = action.payload;
      const ifSameFactory = testIfSameFactory(state.cartToBookingManager, factory);

      if (!ifSameFactory) {
        state.errorCartToBookingManager.errorChangeQuantity = 'אין להכניס מוצרים ממפעל שונה';
        return
      }
      const productIndex = state.cartToBookingManager.findIndex(pr => pr._id === _id);
      
      if (productIndex === -1) { 
        state.cartToBookingManager.push({factory, _id, quantity: Number(quantity) });
         return }
      
      if (quantity === '0') { 
        state.cartToBookingManager = removeItemFromCart(state.cartToBookingManager, _id);
      }else {
        state.cartToBookingManager = state.cartToBookingManager.map( (pr, i) => {
          return i === productIndex ? {factory, _id, quantity: Number(quantity)} : pr;
        })
      }
      state.errorCartToBookingManager.errorChangeQuantity = '';
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      ordersApi.endpoints.getActiveOrders.matchFulfilled, (state, action) => {
      state.allActiveOrders = action.payload;
    });
    builder.addMatcher(
      ordersApi.endpoints.sendAnInvitation.matchFulfilled, (state, action) => {
        state.allActiveOrders.push(action.payload.newActiveOrder);
    });
    builder.addMatcher(
      ordersApi.endpoints.sendOrderFromCart.matchFulfilled, (state, action) => {
        state.allActiveOrders = action.payload.activeOrders;
        state.cartToDeliver = [];
    });
    builder.addMatcher(
      oldOrdersApi.endpoints.returnProduct.matchFulfilled, (state, action) => {
        state.allActiveOrders.push(action.payload.newActiveOrder);
    });
    builder.addMatcher(
      ordersApi.endpoints.removeProduct.matchFulfilled, (state, action) => {
        state.allActiveOrders = state.allActiveOrders.map(active => {
          return action.payload._id === active._id ? action.payload : active;
        });  
    });
  },
});

export const actions = slice.actions;
export default slice.reducer;
