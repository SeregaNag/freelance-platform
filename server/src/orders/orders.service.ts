import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto & { customerId: string }) {
    return this.prisma.order.create({
      data: {
        title: createOrderDto.title,
        description: createOrderDto.description,
        price: createOrderDto.price,
        status: createOrderDto.status || 'pending',
        category: createOrderDto.category,
        deadline: createOrderDto.deadline,
        skills: {
          set: createOrderDto.skills || []
        },
        minBudget: createOrderDto.minBudget,
        maxBudget: createOrderDto.maxBudget,
        attachments: {
          set: createOrderDto.attachments || []
        },
        customer: {
          connect: { id: createOrderDto.customerId },
        },
      },
      include: {
        customer: true,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        freelancer: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        freelancer: true,
      },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({ where: { id }, data: updateOrderDto });
  }

  async remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }

  async takeOrder(orderId: string, freelancerId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }
    if (order.status !== 'pending') {
      throw new BadRequestException('Заказ недоступен для взятия');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        freelancer: {
          connect: { id: freelancerId },
        },
        status: 'waiting_confirmation',
      },
      include: {
        customer: true,
        freelancer: true,
      },
    });
  }

  async confirmOrder(orderId: string, customerId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }
    if (order.customerId !== customerId) {
      throw new BadRequestException('Вы не можете подтвердить этот заказ');
    }
    if (order.status !== 'waiting_confirmation') {
      throw new BadRequestException('Заказ не может быть подтвержден');
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'in_progress',
      },
      include: {
        customer: true,
        freelancer: true,
      },
    });
  }
}
