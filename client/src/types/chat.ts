export interface Message {
    id: string;
    content: string;
    orderId: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    status: 'SENT' | 'DELIVERED' | 'READ';
    sender?: {
        id: string;
        name: string;
    };
    receiver?: {
        id: string;
        name: string;
    };
} 