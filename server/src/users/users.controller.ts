import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.register(createUserDto);
    const { password, ...result } = user;
    return result;
  }
}
