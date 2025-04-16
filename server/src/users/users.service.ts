import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';  
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async register(createUserDto: CreateUserDto) {
    try {
      const hashedPassword: string = await bcrypt.hash(
        createUserDto.password,
        10,
      );
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
          roles: createUserDto.roles || ['customer'],
        },
      });
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed due to unknown error');
    }
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        skills: true,
        experience: true,
        rating: true,
        completedOrders: true,
        location: true,
        website: true,
        socialLinks: true,
        isVerified: true,
        lastSeen: true,
        roles: true,
      },
    });
    return user;
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      }
    })
  }
}
