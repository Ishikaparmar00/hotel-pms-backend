import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatePlanService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.ratePlan.create({
      data,
    });
  }

  findAll() {
    return this.prisma.ratePlan.findMany({
      include: {
        roomType: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.ratePlan.findUnique({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.ratePlan.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.ratePlan.delete({
      where: { id },
    });
  }
}