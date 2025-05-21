export class CreateMessageDto {
    content: string;
    orderId: string;
    senderId?: string;
    receiverId?: string;
}