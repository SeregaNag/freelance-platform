import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import { WsAuthMiddleware } from './ws-auth.middleware';
import { WsJwtGuard } from './ws-jwt.guard';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3001',
        credentials: true,
    },
    path: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    constructor(
        private readonly chatService: ChatService,
        private readonly wsAuthMiddleware: WsAuthMiddleware
    ) {}

    afterInit() {
        this.server.use((socket, next) => this.wsAuthMiddleware.use(socket, next));
    }
    
    handleConnection() {}
    handleDisconnect() {}
    
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('message')
    async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const userId = client.data.user.userId;
        const hasAccess = await this.chatService.checkOrderAccess(payload.orderId, userId);
        if (!hasAccess) {
            throw new Error('Unauthorized');
        }
        
        const message = await this.chatService.createMessage(payload, userId);
        this.server.to(`order:${payload.orderId}`).emit('message', message);
        return message;
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('joinOrder')
    async handleJoinOrder(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const userId = client.data.user.userId;
        const hasAccess = await this.chatService.checkOrderAccess(payload.orderId, userId);
        if (!hasAccess) {
            throw new Error('Unauthorized');
        }
        
        client.join(`order:${payload.orderId}`);
        const messages = await this.chatService.getMessagesByOrderId(payload.orderId);
        await this.chatService.markMessagesAsDelivered(payload.orderId, userId);
        
        return messages;
    }
}