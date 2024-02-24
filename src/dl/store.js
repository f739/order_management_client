import { configureStore } from "@reduxjs/toolkit";
import general from "./slices/general";

export const store = configureStore({
  reducer: {
    general,
  },
});
