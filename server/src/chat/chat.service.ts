import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
        try {
            return await this.prisma.message.create({
                data: {
                    content: createMessageDto.content,
                    orderId: createMessageDto.orderId,
                    senderId,
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
}
