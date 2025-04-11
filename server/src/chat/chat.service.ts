import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
        try {
            // Получаем информацию о заказе, чтобы определить получателя
            const order = await this.prisma.order.findUnique({
                where: { id: createMessageDto.orderId },
                select: { customerId: true, freelancerId: true }
            });

            if (!order) {
                throw new Error('Order not found');
            }

            // Определяем получателя сообщения
            const receiverId = order.customerId === senderId ? order.freelancerId : order.customerId;

            return await this.prisma.message.create({
                data: {
                    content: createMessageDto.content,
                    orderId: createMessageDto.orderId,
                    senderId,
                    receiverId,
                    isRead: false, // По умолчанию сообщение непрочитанное
                },
                include: {
                    sender: true,
                },
            });
        } catch (error) {
            throw new Error('Failed to create message');
        }
    }

    async getMessagesByOrderId(orderId: string) {
        try {
            return await this.prisma.message.findMany({
                where: {
                    orderId,
                },
                include: {
                    sender: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
        } catch (error) {
            throw new Error('Failed to get messages');
        }
    }

    async checkOrderAccess(orderId: string, userId: string) {
        const order = await this.prisma.order.findUnique({
            where: {
                id: orderId,
            },
            select: { customerId: true, freelancerId: true },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.customerId !== userId && order.freelancerId !== userId) {
            throw new Error('Unauthorized');
        }
        return order?.customerId === userId || order?.freelancerId === userId;
    }

    async markMessagesAsRead(orderId: string, userId: string) {
        try {
            await this.prisma.message.updateMany({
                where: {
                    orderId,
                    senderId: { not: userId }, // Помечаем как прочитанные только сообщения от других пользователей
                    isRead: false,
                },
                data: {
                    isRead: true,
                },
            });
        } catch (error) {
            throw new Error('Failed to mark messages as read');
        }
    }
}
