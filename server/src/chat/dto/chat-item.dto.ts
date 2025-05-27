export interface ChatItemDto {
    orderId: string;
    orderTitle: string;
    participantId: string;
    participantName: string;
    participantAvatar: string | null;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount: number;
    isOnline: boolean;
} 