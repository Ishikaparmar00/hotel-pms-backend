import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.billing.create({
      data,
    });
  }

  findAll() {
    return this.prisma.billing.findMany();
  }

  findOne(id: number) {
    return this.prisma.billing.findUnique({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.billing.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.billing.delete({
      where: { id },
    });
  }
}