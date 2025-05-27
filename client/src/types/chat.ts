export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    orderId: string;
    status: 'SENT' | 'DELIVERED' | 'READ';
    createdAt: string;
    sender?: {
        id: string;
        name: string;
    };
    receiver?: {
        id: string;
        name: string;
    };
}

export interface ChatItem {
    orderId: string;
    orderTitle: string;
    participantId: string;
    participantName: string;
    participantAvatar: string | null;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    isOnline: boolean;
} 