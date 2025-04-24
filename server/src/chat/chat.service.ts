import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: createMessageDto.orderId },
      select: { customerId: true, freelancerId: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const receiverId = order.customerId === senderId ? order.freelancerId : order.customerId;

    if (!receiverId) {
      throw new Error('Receiver not found');
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
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
            select: { customerId: true, freelancerId: true },
        });

        if (!order) {
      return false;
        }

    return order.customerId === userId || order.freelancerId === userId;
    }
}
