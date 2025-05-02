import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../features/filterSlice";
import userReducer from "../features/userSlice";
import ordersReducer from "../features/ordersSlice";
import profileReducer from "../features/profileSlice";
import chatReducer from "../features/chatSlice";
import themeReducer from "../features/themeSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    user: userReducer,
    orders: ordersReducer,
    profile: profileReducer,
    chat: chatReducer,
    theme: themeReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;