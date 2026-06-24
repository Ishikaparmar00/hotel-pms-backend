import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.property.create({
      data,
    });
  }

  findAll() {
    return this.prisma.property.findMany();
  }

  findOne(id: number) {
    return this.prisma.property.findUnique({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.property.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.property.delete({
      where: { id },
    });
  }
}