import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
        console.log('Creating message. Order ID:', createMessageDto.orderId, 'Sender ID:', senderId);
        
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: createMessageDto.orderId },
                select: { customerId: true, freelancerId: true },
            });

            if (!order) {
                throw new Error('Order not found');
            }

            let receiverId: string;

            // Если отправитель - заказчик
            if (order.customerId === senderId) {
                // Если в заказе уже есть исполнитель, отправляем сообщение ему
                if (order.freelancerId) {
                    receiverId = order.freelancerId;
                } 
                // Иначе получаем получателя из параметров (если указан конкретный фрилансер)
                else if (createMessageDto.receiverId) {
                    // Проверим, есть ли у этого фрилансера заявка на заказ
                    const hasApplication = await this.prisma.orderApplication.findFirst({
                        where: {
                            orderId: createMessageDto.orderId,
                            freelancerId: createMessageDto.receiverId,
                        },
                    });
                    
                    if (!hasApplication) {
                        throw new Error('Freelancer has not applied for this order');
                    }
                    
                    receiverId = createMessageDto.receiverId;
                } else {
                    throw new Error('Receiver ID is required when there is no assigned freelancer');
                }
            } 
            // Если отправитель - фрилансер
            else {
                // Получатель всегда заказчик
                receiverId = order.customerId;
            }

            console.log('Message receiver ID:', receiverId);

            return await this.prisma.message.create({
                data: {
                    content: createMessageDto.content,
                    orderId: createMessageDto.orderId,
                    senderId,
                    receiverId,
                    status: 'SENT',
                },
                include: {
                    sender: true,
                    receiver: true,
                },
            });
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    }

    async getMessagesByOrderId(orderId: string) {
        return await this.prisma.message.findMany({
            where: {
                orderId,
            },
            include: {
                sender: true,
                receiver: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async getMessagesBetweenUsers(orderId: string, user1Id: string, user2Id: string) {
        return await this.prisma.message.findMany({
            where: {
                orderId,
                OR: [
                    // Сообщения от user1 к user2
                    {
                        senderId: user1Id,
                        receiverId: user2Id,
                    },
                    // Сообщения от user2 к user1
                    {
                        senderId: user2Id,
                        receiverId: user1Id,
                    },
                ],
            },
            include: {
                sender: true,
                receiver: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async markMessagesAsDelivered(orderId: string, userId: string) {
        await this.prisma.message.updateMany({
            where: {
                orderId,
                receiverId: userId,
                status: 'SENT',
            },
            data: {
                status: 'DELIVERED',
            },
        });
    }

    async markMessagesAsRead(orderId: string, userId: string) {
        await this.prisma.message.updateMany({
            where: {
                orderId,
                receiverId: userId,
                status: { in: ['SENT', 'DELIVERED'] },
            },
            data: {
                status: 'READ',
            },
        });
    }

    async checkOrderAccess(orderId: string, userId: string): Promise<boolean> {
        console.log('Checking order access. Order ID:', orderId, 'User ID:', userId);
        
        try {
            // Проверяем, является ли пользователь заказчиком или исполнителем
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
                select: { customerId: true, freelancerId: true },
            });

            console.log('Found order:', order);

            if (!order) {
                console.log('Order not found');
                return false;
            }

            // Если пользователь - заказчик или назначенный исполнитель, даем доступ
            if (order.customerId === userId || order.freelancerId === userId) {
                console.log('User is customer or assigned freelancer, access granted');
                return true;
            }

            // Проверяем, подал ли этот фрилансер заявку на заказ
            const application = await this.prisma.orderApplication.findFirst({
                where: {
                    orderId,
                    freelancerId: userId,
                },
            });

            const hasApplication = !!application;
            console.log('User has application for this order:', hasApplication);
            
            return hasApplication;
        } catch (error) {
            console.error('Error checking order access:', error);
            return false;
        }
    }
}
