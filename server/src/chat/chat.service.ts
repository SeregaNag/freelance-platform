import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatItemDto } from './dto/chat-item.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
        
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
        try {
            // Проверяем, является ли пользователь заказчиком или исполнителем
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
                select: { customerId: true, freelancerId: true },
            });

            if (!order) {
                return false;
            }

            // Если пользователь - заказчик или назначенный исполнитель, даем доступ
            if (order.customerId === userId || order.freelancerId === userId) {
                return true;
            }

            // Проверяем, подал ли этот фрилансер заявку на заказ
            const application = await this.prisma.orderApplication.findFirst({
                where: {
                    orderId,
                    freelancerId: userId,
                },
            });

            return !!application;
        } catch (error) {
            console.error('Error checking order access:', error);
            return false;
        }
    }

    async getUserChats(userId: string) {
        try {
            // Получаем заказы где пользователь является заказчиком
            const customerOrders = await this.prisma.order.findMany({
                where: { 
                    customerId: userId,
                    OR: [
                        { freelancerId: { not: null } }, // Есть назначенный исполнитель
                        { applications: { some: {} } }   // Есть заявки
                    ]
                },
                include: {
                    freelancer: {
                        select: { id: true, name: true, email: true, avatar: true }
                    },
                    applications: {
                        include: {
                            freelancer: {
                                select: { id: true, name: true, email: true, avatar: true }
                            }
                        }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        include: {
                            sender: { select: { id: true, name: true } }
                        }
                    }
                }
            });

            // Получаем заказы где пользователь является исполнителем
            const freelancerOrders = await this.prisma.order.findMany({
                where: { freelancerId: userId },
                include: {
                    customer: {
                        select: { id: true, name: true, email: true, avatar: true }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                        include: {
                            sender: { select: { id: true, name: true } }
                        }
                    }
                }
            });

            // Получаем заказы где пользователь подал заявку
            const applicationOrders = await this.prisma.orderApplication.findMany({
                where: { freelancerId: userId },
                include: {
                    order: {
                        include: {
                            customer: {
                                select: { id: true, name: true, email: true, avatar: true }
                            },
                            messages: {
                                orderBy: { createdAt: 'desc' },
                                take: 1,
                                include: {
                                    sender: { select: { id: true, name: true } }
                                }
                            }
                        }
                    }
                }
            });

            const chats: ChatItemDto[] = [];

            // Обрабатываем заказы где пользователь - заказчик
            for (const order of customerOrders) {
                if (order.freelancer) {
                    // Есть назначенный исполнитель
                    const unreadCount = await this.prisma.message.count({
                        where: {
                            orderId: order.id,
                            receiverId: userId,
                            status: { in: ['SENT', 'DELIVERED'] }
                        }
                    });

                    chats.push({
                        orderId: order.id,
                        orderTitle: order.title,
                        participantId: order.freelancer.id,
                        participantName: order.freelancer.name || order.freelancer.email,
                        participantAvatar: order.freelancer.avatar,
                        lastMessage: order.messages[0]?.content,
                        lastMessageTime: order.messages[0]?.createdAt,
                        unreadCount,
                        isOnline: false // TODO: реализовать статус онлайн
                    });
                } else {
                    // Есть заявки, но нет назначенного исполнителя
                    for (const application of order.applications) {
                        const unreadCount = await this.prisma.message.count({
                            where: {
                                orderId: order.id,
                                receiverId: userId,
                                senderId: application.freelancer.id,
                                status: { in: ['SENT', 'DELIVERED'] }
                            }
                        });

                        // Получаем последнее сообщение между заказчиком и этим фрилансером
                        const lastMessage = await this.prisma.message.findFirst({
                            where: {
                                orderId: order.id,
                                OR: [
                                    { senderId: userId, receiverId: application.freelancer.id },
                                    { senderId: application.freelancer.id, receiverId: userId }
                                ]
                            },
                            orderBy: { createdAt: 'desc' }
                        });

                        chats.push({
                            orderId: order.id,
                            orderTitle: order.title,
                            participantId: application.freelancer.id,
                            participantName: application.freelancer.name || application.freelancer.email,
                            participantAvatar: application.freelancer.avatar,
                            lastMessage: lastMessage?.content,
                            lastMessageTime: lastMessage?.createdAt,
                            unreadCount,
                            isOnline: false
                        });
                    }
                }
            }

            // Обрабатываем заказы где пользователь - исполнитель
            for (const order of freelancerOrders) {
                const unreadCount = await this.prisma.message.count({
                    where: {
                        orderId: order.id,
                        receiverId: userId,
                        status: { in: ['SENT', 'DELIVERED'] }
                    }
                });

                chats.push({
                    orderId: order.id,
                    orderTitle: order.title,
                    participantId: order.customer.id,
                    participantName: order.customer.name || order.customer.email,
                    participantAvatar: order.customer.avatar,
                    lastMessage: order.messages[0]?.content,
                    lastMessageTime: order.messages[0]?.createdAt,
                    unreadCount,
                    isOnline: false
                });
            }

            // Обрабатываем заказы где пользователь подал заявку (но не назначен исполнителем)
            for (const application of applicationOrders) {
                const order = application.order;
                
                // Пропускаем если пользователь уже назначен исполнителем
                if (order.freelancerId === userId) continue;

                const unreadCount = await this.prisma.message.count({
                    where: {
                        orderId: order.id,
                        receiverId: userId,
                        status: { in: ['SENT', 'DELIVERED'] }
                    }
                });

                // Получаем последнее сообщение между фрилансером и заказчиком
                const lastMessage = await this.prisma.message.findFirst({
                    where: {
                        orderId: order.id,
                        OR: [
                            { senderId: userId, receiverId: order.customer.id },
                            { senderId: order.customer.id, receiverId: userId }
                        ]
                    },
                    orderBy: { createdAt: 'desc' }
                });

                chats.push({
                    orderId: order.id,
                    orderTitle: order.title,
                    participantId: order.customer.id,
                    participantName: order.customer.name || order.customer.email,
                    participantAvatar: order.customer.avatar,
                    lastMessage: lastMessage?.content,
                    lastMessageTime: lastMessage?.createdAt,
                    unreadCount,
                    isOnline: false
                });
            }

            // Убираем дубликаты и сортируем по времени последнего сообщения
            const uniqueChats = chats.filter((chat, index, self) => 
                index === self.findIndex(c => c.orderId === chat.orderId && c.participantId === chat.participantId)
            );

            return uniqueChats.sort((a, b) => {
                if (!a.lastMessageTime && !b.lastMessageTime) return 0;
                if (!a.lastMessageTime) return 1;
                if (!b.lastMessageTime) return -1;
                return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
            });

        } catch (error) {
            console.error('Error getting user chats:', error);
            throw error;
        }
    }
}
