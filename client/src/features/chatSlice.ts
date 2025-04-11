import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState } from "../types/message";
import { Message } from "../types/message";

const initialState: ChatState = {
    messages: [],
    orderId: null,
    isConnected: false,
    unreadCount: 0,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        getMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
            state.unreadCount = action.payload.filter(msg => !msg.isRead).length;
        },
        setOrderId: (state, action: PayloadAction<string>) => {
            state.orderId = action.payload;
        },
        sendMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount++;
            }
        },
        markMessagesAsRead: (state) => {
            state.messages = state.messages.map(msg => ({ ...msg, isRead: true }));
            state.unreadCount = 0;
        },
        setIsConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
    },
})

export const { getMessages, setOrderId, sendMessage, markMessagesAsRead, setIsConnected } = chatSlice.actions;
export default chatSlice.reducer;
