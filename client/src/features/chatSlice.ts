import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../types/message";

interface ChatState {
    messages: Message[];
    isConnected: boolean;
    orderId: string | null;
}

const initialState: ChatState = {
    messages: [],
    isConnected: false,
    orderId: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        getMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        sendMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        setIsConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        setOrderId: (state, action: PayloadAction<string>) => {
            state.orderId = action.payload;
        },
        markMessagesAsRead: (state) => {
            state.messages = state.messages.map(message => ({
                ...message,
                status: 'READ'
            }));
        },
    },
});

export const { getMessages, sendMessage, setIsConnected, setOrderId, markMessagesAsRead } = chatSlice.actions;
export default chatSlice.reducer;
