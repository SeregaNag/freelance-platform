import { OrderStatusFilter } from "@/types/order";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  status: OrderStatusFilter;
  searchQuery: string;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  selectedCategories: string[];
  selectedSkills: string[];
}

const initialState: FilterState = {
  status: "all",
  searchQuery: "",
  priceRange: {
    min: null,
    max: null,
  },
  selectedCategories: [],
  selectedSkills: [],
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<OrderStatusFilter>) {
      state.status = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setPriceRange(state, action: PayloadAction<{ min: number | null; max: number | null }>) {
      state.priceRange = action.payload;
    },
    setSelectedCategories(state, action: PayloadAction<string[]>) {
      state.selectedCategories = action.payload;
    },
    addCategory(state, action: PayloadAction<string>) {
      if (!state.selectedCategories.includes(action.payload)) {
        state.selectedCategories.push(action.payload);
      }
    },
    removeCategory(state, action: PayloadAction<string>) {
      state.selectedCategories = state.selectedCategories.filter(
        (category) => category !== action.payload
      );
    },
    setSelectedSkills(state, action: PayloadAction<string[]>) {
      state.selectedSkills = action.payload;
    },
    addSkill(state, action: PayloadAction<string>) {
      if (!state.selectedSkills.includes(action.payload)) {
        state.selectedSkills.push(action.payload);
      }
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.selectedSkills = state.selectedSkills.filter(
        (skill) => skill !== action.payload
      );
    },
    clearAllFilters(state) {
      state.status = "all";
      state.searchQuery = "";
      state.priceRange = { min: null, max: null };
      state.selectedCategories = [];
      state.selectedSkills = [];
    },
  },
});

export const {
  setStatusFilter,
  setSearchQuery,
  setPriceRange,
  setSelectedCategories,
  addCategory,
  removeCategory,
  setSelectedSkills,
  addSkill,
  removeSkill,
  clearAllFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
