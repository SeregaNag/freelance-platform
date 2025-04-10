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
    
    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
        console.log('Auth token:', client.handshake.auth.token);
        console.log('Cookies:', client.handshake.headers.cookie);
        console.log('Client data:', client.data);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }
    
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('message')
    async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        console.log('Received message payload:', payload);
        console.log('Client data:', client.data);
        const userId = client.data.user.userId;
        console.log('User ID:', userId);
        
        const hasAccess = await this.chatService.checkOrderAccess(payload.orderId, userId);
        if (!hasAccess) {
            console.log('Access denied for user:', userId);
            throw new Error('Unauthorized');
        }
        
        console.log('Creating message with data:', { ...payload, senderId: userId });
        const message = await this.chatService.createMessage(payload, userId);
        console.log('Created message:', message);
        this.server.to(`order:${payload.orderId}`).emit('message', message);
        return message;
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('joinOrder')
    async handleJoinOrder(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        console.log('Joining order:', payload);
        const userId = client.data.user.userId;
        const hasAccess = await this.chatService.checkOrderAccess(payload.orderId, userId);
        if (!hasAccess) {
            console.log('Access denied for user:', userId);
            throw new Error('Unauthorized');
        }
        
        client.join(`order:${payload.orderId}`);
        const messages = await this.chatService.getMessagesByOrderId(payload.orderId);
        return messages;
    }
}