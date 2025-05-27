import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
    WsException,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io'
import { WsAuthMiddleware } from './ws-auth.middleware';
import { WsJwtGuard } from './ws-jwt.guard';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma.service';

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
        private readonly wsAuthMiddleware: WsAuthMiddleware,
        private readonly prisma: PrismaService
    ) {}

    afterInit() {
        this.server.use((socket, next) => this.wsAuthMiddleware.use(socket, next));
    }
    
    handleConnection(client: Socket) {
    }
    
    handleDisconnect(client: Socket) {
    }
    
    @UseGuards(WsJwtGuard)
    @SubscribeMessage('message')
    async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        try {
            const userId = client.data.user.userId;
            
            const hasAccess = await this.chatService.checkOrderAccess(payload.orderId, userId);
            if (!hasAccess) {
                return { error: true, message: 'Unauthorized: You don\'t have access to this order' };
            }
            
            const messagePayload = {
                ...payload,
                senderId: userId
            };
            
            const message = await this.chatService.createMessage(messagePayload, userId);
            
            this.server.to(`order:${payload.orderId}`).emit('message', message);
            
            return message;
        } catch (error) {
            console.error('Error handling message:', error);
            return { 
                error: true, 
                message: error instanceof Error ? error.message : 'Failed to process message'
            };
        }
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('joinOrder')
    async handleJoinOrder(@ConnectedSocket() client: Socket, @MessageBody() payload: any) {
        
        try {
            const userId = client.data.user.userId;
            
            const hasAccess = await this.chatService.checkOrderAccess(payload.orderId, userId);
            if (!hasAccess) {
                console.error('Access denied for order:', payload.orderId);
                return { error: true, message: 'Unauthorized: You don\'t have access to this order' };
            }
            
            // Получаем информацию о заказе
            const order = await this.prisma.order.findUnique({
                where: { id: payload.orderId },
                select: { customerId: true, freelancerId: true }
            });
            
            if (!order) {
                return { error: true, message: 'Order not found' };
            }
            
            // Определяем собеседника в зависимости от роли пользователя
            let interlocutorId: string | null = null;
            
            // Если пользователь - заказчик и указан конкретный фрилансер
            if (order.customerId === userId && payload.freelancerId) {
                interlocutorId = payload.freelancerId;
                
                // Проверяем, имеет ли указанный фрилансер заявку на этот заказ
                const hasApplication = await this.prisma.orderApplication.findFirst({
                    where: {
                        orderId: payload.orderId,
                        freelancerId: payload.freelancerId
                    }
                });
                
                if (!hasApplication && order.freelancerId !== payload.freelancerId) {
                    return { error: true, message: 'Freelancer has not applied for this order' };
                }
            } 
            // Если пользователь - фрилансер, его собеседник всегда заказчик
            else if (order.customerId !== userId) {
                interlocutorId = order.customerId;
            }
            // Если пользователь - заказчик, но не указан конкретный фрилансер
            else if (!payload.freelancerId && order.freelancerId) {
                interlocutorId = order.freelancerId;
            }
            
            
            // Присоединяем клиента к общей комнате заказа
            client.join(`order:${payload.orderId}`);
            
            // Получаем сообщения между пользователем и собеседником (если он определен)
            let messages: any[] = [];
            if (interlocutorId) {
                messages = await this.chatService.getMessagesBetweenUsers(payload.orderId, userId, interlocutorId);
                await this.chatService.markMessagesAsDelivered(payload.orderId, userId);
            } else if (order.customerId === userId) {
                // Если заказчик не указал конкретного фрилансера и нет назначенного исполнителя,
                // возвращаем список всех фрилансеров с заявками
                const applicants = await this.prisma.orderApplication.findMany({
                    where: { orderId: payload.orderId },
                    include: {
                        freelancer: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                });
                
                return { 
                    applicants: applicants.map(app => app.freelancer),
                    messages: []
                };
            }
            
            
            return messages;
        } catch (error) {
            console.error('Error joining order:', error);
            return { 
                error: true, 
                message: error instanceof Error ? error.message : 'Failed to join order'
            };
        }
    }
}