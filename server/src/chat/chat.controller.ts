import { Controller, Get, UseGuards, Param, Post, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';

interface RequestWithUser extends Request {
    user: {
        userId: string;
    };
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('messages/:orderId')
    async getMessages(@Param('orderId') orderId: string, @Req() req: RequestWithUser) {
        const userId = req.user.userId;
        const hasAccess = await this.chatService.checkOrderAccess(orderId, userId);
        if (!hasAccess) {
            throw new Error('Unauthorized');
        }
        return this.chatService.getMessagesByOrderId(orderId);
    }

    @Post('messages')
    async createMessage(@Body() createMessageDto: CreateMessageDto, @Req() req: RequestWithUser) {
        const userId = req.user.userId;
        const hasAccess = await this.chatService.checkOrderAccess(createMessageDto.orderId, userId);
        if (!hasAccess) {
            throw new Error('Unauthorized');
        }
        return this.chatService.createMessage(createMessageDto, userId);
    }

    @Post(':orderId/messages/read')
    async markMessagesAsRead(
        @Param('orderId') orderId: string,
        @Req() req: RequestWithUser,
    ) {
        const userId = req.user.userId;
        return this.chatService.markMessagesAsRead(orderId, userId);
    }
} 