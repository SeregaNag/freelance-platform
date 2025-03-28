import { Controller, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Post, Body, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    const userProfile = this.usersService.getProfile(req.user.userId);
    return userProfile;
  }
}
