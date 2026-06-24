import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuestService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.guest.findMany();
  }

  async findOne(id: number) {
    return this.prisma.guest.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.guest.create({
      data,
    });
  }

  async update(id: number, data: any) {
    return this.prisma.guest.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.guest.delete({
      where: { id },
    });
  }
}