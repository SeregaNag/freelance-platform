import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma.service';
import { WsJwtGuard } from './ws-jwt.guard';
import { WsAuthMiddleware } from './ws-auth.middleware';
import { ChatController } from './chat.controller';

@Module({
    controllers: [ChatController],
    providers: [ChatGateway, ChatService, PrismaService, WsJwtGuard, WsAuthMiddleware],
})
export class ChatModule {}
