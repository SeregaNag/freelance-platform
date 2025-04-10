import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.ordersService.create({ ...createOrderDto, customerId: userId });
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @Post(':id/take')
  @UseGuards(JwtAuthGuard)
  async takeOrder(@Param('id') id: string, @Req() req: Request) {
    const freelancerId = (req as any).user.userId;
    return this.ordersService.takeOrder(id, freelancerId);
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmOrder(@Param('id') id: string, @Req() req: Request) {
    const customerId = (req as any).user.userId;
    return this.ordersService.confirmOrder(id, customerId);
  }
}
