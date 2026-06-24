import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelroomService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.hotelRoom.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.hotelRoom.findMany();
  }

  async findOne(id: number) {
    return this.prisma.hotelRoom.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.hotelRoom.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.hotelRoom.delete({
      where: { id },
    });
  }
}