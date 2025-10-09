import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productosReducer from "./slices/productosSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    productos: productosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
