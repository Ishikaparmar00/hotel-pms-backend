import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomBlockService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.roomBlock.create({
      data,
    });
  }

  findAll() {
    return this.prisma.roomBlock.findMany();
  }

  findOne(id: number) {
    return this.prisma.roomBlock.findUnique({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.roomBlock.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.roomBlock.delete({
      where: { id },
    });
  }
}