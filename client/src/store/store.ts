import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../features/filterSlice";
import userReducer from "../features/userSlice";
import ordersReducer from "../features/ordersSlice";

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    user: userReducer,
    orders: ordersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
