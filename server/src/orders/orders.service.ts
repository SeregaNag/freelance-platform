import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto & { customerId: string }) {
    return this.prisma.order.create({
      data: {
        title: createOrderDto.title,
        description: createOrderDto.description,
        price: createOrderDto.price,
        customer: {
          connect: { id: createOrderDto.customerId },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany();
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({ where: { id }, data: updateOrderDto });
  }

  async remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}
