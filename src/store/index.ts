import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productosReducer from "./slices/productosSlice";
import clientesReducer from "./slices/clientesSlice";
import empresasReducer from "./slices/empresasSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    productos: productosReducer,
    clientes: clientesReducer,
    empresas: empresasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
