import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.room.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.room.findMany();
  }

  async findOne(id: number) {
    return this.prisma.room.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.room.delete({
      where: { id },
    });
  }
}