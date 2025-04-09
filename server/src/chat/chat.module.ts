import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma.service';
import { WsJwtGuard } from './ws-jwt.guard';
import { WsAuthMiddleware } from './ws-auth.middleware';

@Module({
    providers: [ChatGateway, ChatService, PrismaService, WsJwtGuard, WsAuthMiddleware],
})
export class ChatModule {}
