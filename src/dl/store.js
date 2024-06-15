import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import general from "./slices/general";
import categories from "./slices/categories";
import suppliers from "./slices/suppliers";
import measures from "./slices/measures";
import products from "./slices/products";
import orders from "./slices/orders";
import users from "./slices/users";
import logger from "./slices/logger";
import issuingReports from "./slices/issuingReports";
import { ordersApi } from './api/ordersApi';
import { usersApi } from './api/usersApi';
import { categoriesApi } from './api/categoriesApi'
import { productsApi } from './api/productsApi'
import { measuresApi } from './api/measuresApi'
import { suppliersApi } from './api/suppliersApi'
import { oldOrdersApi } from './api/oldOrdersApi'


const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: productsApi.endpoints.addPrice.matchFulfilled,
  effect: async (action, { dispatch }) => {
    try {
      await dispatch(ordersApi.endpoints.getActiveOrders.initiate());
      console.log('Triggered ordersApi.getActiveOrders');
    } catch (err) {
      console.log(err, 'Error triggering ordersApi.getActiveOrders');
    }
  }
});


const consoleMid = store => next => action => {
  console.log(`action: ${JSON.stringify(action)}`);
  next(action);
}

export const store = configureStore({
  reducer: {
    [ordersApi.reducerPath]: ordersApi.reducer,
    [oldOrdersApi.reducerPath]: oldOrdersApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [measuresApi.reducerPath]: measuresApi.reducer,
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    general,
    categories,
    suppliers,
    measures,
    products,
    orders,
    users,
    logger,
    issuingReports,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    ordersApi.middleware,
    oldOrdersApi.middleware,
    usersApi.middleware,
    categoriesApi.middleware,
    productsApi.middleware,
    measuresApi.middleware,
    suppliersApi.middleware,
    consoleMid,
),
});

setupListeners(store.dispatch);