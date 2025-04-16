import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
        dest: './uploads',
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
        },
    }),
],
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
})
export class UsersModule {}
