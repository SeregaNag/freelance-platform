import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto, senderId: string) {
       return this.prisma.message.create({
        data: {
            content: createMessageDto.content,
            orderId: createMessageDto.orderId,
            senderId,
        },
        include: {
            sender: true,
        },
       })
    }

    async getMessagesByOrderId(orderId: string) {
        return this.prisma.message.findMany({
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
    }
}
