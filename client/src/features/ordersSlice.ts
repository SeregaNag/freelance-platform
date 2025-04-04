import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrdersState {
  modifiedOrderIds: string[];
}

const initialState: OrdersState = {
  modifiedOrderIds: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    orderModified: (state, action: PayloadAction<string>) => {
      if (!state.modifiedOrderIds.includes(action.payload)) {
        state.modifiedOrderIds.push(action.payload);
      }
    },
    clearModifiedOrders: (state) => {
      state.modifiedOrderIds = [];
    },
  },
});

export const { orderModified, clearModifiedOrders } = ordersSlice.actions;
export default ordersSlice.reducer; 