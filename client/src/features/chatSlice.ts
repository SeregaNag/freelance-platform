import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState } from "../types/message";
import { Message } from "../types/message";

const initialState: ChatState = {
    messages: [],
    orderId: null,
    isConnected: false,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        getMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        setOrderId: (state, action: PayloadAction<string>) => {
            state.orderId = action.payload;
        },
        sendMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        setIsConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
    },
})

export const { getMessages, setOrderId, sendMessage, setIsConnected } = chatSlice.actions;
export default chatSlice.reducer;
