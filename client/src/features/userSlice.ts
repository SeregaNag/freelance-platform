import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "@/types/roles";

interface UserState {
    role: UserRole;
}

const initialState: UserState = {
    role: "freelancer",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setRole(state, action: PayloadAction<UserRole>) {
            state.role = action.payload;
        },
    },
});

export const { setRole } = userSlice.actions;
export default userSlice.reducer;