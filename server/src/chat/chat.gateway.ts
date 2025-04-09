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

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
    },
    namespace: 'chat',
    middlewares: [WsAuthMiddleware],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log('Client connected');
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected');
    }
    
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('message')
    async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        const {userId} = client.data.user.userId;
        console.log('Message received', payload);
        this.server.emit('message', payload);
    }
}