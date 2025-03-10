import { OrderStatusFilter } from "@/types/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  status: OrderStatusFilter;
}

const initialState: FilterState = {
  status: "all",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<OrderStatusFilter>) {
      state.status = action.payload;
    },
  },
});

export const { setStatusFilter } = filterSlice.actions;
export default filterSlice.reducer;
