import { createSlice } from "@reduxjs/toolkit";
import { ordersApi } from '../api/ordersApi';
import { oldOrdersApi } from "../api/oldOrdersApi";
import { findBestPrice } from "../../components/findBestPrice";

const testIfSameBranch = (state, branch) => {
  return branch._id === state[0]?.branch._id || state.length === 0;
}
const removeItemFromCart = (state, _id) => {
  return state.filter( product => product._id !== _id);
}

const initialState = {
  allActiveOrders: [],
  pricesToDeliver: {},
  quantitiesToDeliver: {},
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
    setPriceToDeliver(state, action) {
      const { productId, price, _idSupplier } = action.payload;
      state.pricesToDeliver[productId] = { price, _idSupplier };
    },
    setQuantityToDeliver(state, action) {
      const { productId, temporaryQuantity, idInvitation} = action.payload;
      state.quantitiesToDeliver[`${productId}-${idInvitation}`] = temporaryQuantity;
    },
    changeSupplierAction(state, action) {
      const { _idSupplier, product } = action.payload;
      const allPrice = product.price.find( price => price._idSupplier._id === _idSupplier);
      state.pricesToDeliver[product._id] = {_idSupplier: allPrice._idSupplier._id, price: Number(allPrice.price)}

      if (state.cartToDeliver.length > 0) {
        state.cartToDeliver = state.cartToDeliver.map( prod => {
          return prod._id === product._id ?
           {...prod, _idSupplier: allPrice._idSupplier._id, price: Number(allPrice.price)} : prod;
        });
      }
    },
    addToCart(state, action) {
      const {editQuantityToDeliver, idInvitation, ...newProduct} = action.payload;
      const ifSameBranch = testIfSameBranch(state.cartToDeliver, newProduct.branch);

       const ifsupplierExist = 
       state.cartToDeliver[0]?._idSupplier ===  state.pricesToDeliver[newProduct._id]?._idSupplier 
       || state.cartToDeliver.length === 0;
      if(!newProduct.price[0]?._idSupplier?.active) {
        state.errorAddOrRemoveToCart = 'הגדר מחיר תחילה';
        return
      }else if (!ifSameBranch) {
        state.errorAddOrRemoveToCart = 'אין להכניס מוצרים המיועדים למפעל שונה';
      }else if (!ifsupplierExist) {
        state.errorAddOrRemoveToCart = 'ניסית לשים מוצרים מכמה ספקים שונים';
      } else {
        let totalQuantity = Object.entries(state.quantitiesToDeliver)
          .filter(([key, value]) => key.includes(newProduct._id))
          .reduce((acc, [key, value]) => acc + value, 0);

        editQuantityToDeliver ? totalQuantity = editQuantityToDeliver : null;
        
        const price = state.pricesToDeliver[newProduct._id]; 
        state.cartToDeliver.push({...newProduct, temporaryQuantity: totalQuantity, ...price});
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
      const {productId, price} = action.payload;
      const _idSupplier = state.pricesToDeliver[productId]._idSupplier;
      
      state.pricesToDeliver[productId] = { _idSupplier, price };
      state.cartToDeliver = state.cartToDeliver.map( prod => {
        return prod._id !== productId ? prod : {...prod, price, _idSupplier}
      })
    },
    increaseOne( state, action) {
      const { _id, branch} = action.payload;
      const ifSameBranch = testIfSameBranch(state.cartToBookingManager, branch);
      
      if (!ifSameBranch) {
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
    decreaseOne(state, action) {
      const _id = action.payload;
      const productIndex = state.cartToBookingManager.findIndex(pr => pr._id === _id);
      if (productIndex === -1) return; 
      state.cartToBookingManager = state.cartToBookingManager.map((pr, i) => {
        if (i === productIndex && pr.quantity > 0) {
          const updatedProduct = { ...pr, quantity: pr.quantity - 1 };
          if (updatedProduct.quantity === 0) {
            return removeItemFromCart(state.cartToBookingManager, _id);
          }
          return updatedProduct;
        }
        return pr;
      }).flat();
    },
    changeQuantityToBookingManager(state, action) {
      const { _id, branch, quantity } = action.payload;
      const ifSameBranch = testIfSameBranch(state.cartToBookingManager, branch);

      if (!ifSameBranch) {
        state.errorCartToBookingManager.errorChangeQuantity = 'אין להכניס מוצרים ממפעל שונה';
        return
      }
      const productIndex = state.cartToBookingManager.findIndex(pr => pr._id === _id);
      
      if (productIndex === -1) { 
        state.cartToBookingManager.push({...action.payload, quantity: Number(quantity) });
         return }
      
      if (quantity === '0') { 
        state.cartToBookingManager = removeItemFromCart(state.cartToBookingManager, _id);
      }else {
        state.cartToBookingManager = state.cartToBookingManager.map( (pr, i) => {
          return i === productIndex ? {...action.payload, quantity: Number(quantity)} : pr;
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
        state.cartToBookingManager = [];
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
