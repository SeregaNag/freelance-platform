import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../types/message";

// Интерфейс фрилансера с заявкой
interface Applicant {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface ChatState {
    messages: Message[];
    isConnected: boolean;
    orderId: string | null;
    applicants: Applicant[]; // Список фрилансеров с заявками
    selectedApplicant: string | null; // ID выбранного фрилансера для чата
}

const initialState: ChatState = {
    messages: [],
    isConnected: false,
    orderId: null,
    applicants: [],
    selectedApplicant: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        getMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        sendMessage: (state, action: PayloadAction<Message>) => {
            const exists = state.messages.some(msg => msg.id === action.payload.id);
            if (!exists) {
                state.messages.push(action.payload);
            }
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
        setApplicants: (state, action: PayloadAction<Applicant[]>) => {
            state.applicants = action.payload;
        },
        setSelectedApplicant: (state, action: PayloadAction<string | null>) => {
            state.selectedApplicant = action.payload;
        },
    },
});

export const { 
    getMessages, 
    sendMessage, 
    setIsConnected, 
    setOrderId, 
    markMessagesAsRead,
    setApplicants,
    setSelectedApplicant
} = chatSlice.actions;
export default chatSlice.reducer;
