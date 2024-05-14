import { configureStore } from "@reduxjs/toolkit";
import general from "./slices/general";
import categories from "./slices/categories";
import suppliers from "./slices/suppliers";
import measures from "./slices/measures";
import products from "./slices/products";
import orders from "./slices/orders";
import users from "./slices/users";
import logger from "./slices/logger";
import issuingReports from "./slices/issuingReports";

const consoleMid = store => next => action => {
  console.log(`action: ${JSON.stringify(action)}`);
  next(action);
}

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    consoleMid
),
  reducer: {
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
});
