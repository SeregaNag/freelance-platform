export interface Message {
    id: string;
    content: string;
    orderId: string;
    senderId: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
    };
}

export interface ChatState {
    messages: Message[];
    orderId: string | null;
    isConnected: boolean;
}