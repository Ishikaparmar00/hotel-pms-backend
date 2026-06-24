import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomtypeService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.roomType.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.roomType.findMany();
  }

  async findOne(id: number) {
    return this.prisma.roomType.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.roomType.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.roomType.delete({
      where: { id },
    });
  }
}