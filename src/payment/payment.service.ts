import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const payment = await this.prisma.payment.create({
      data,
    });

    const folio = await this.prisma.folio.findUnique({
      where: {
        id: data.folioId,
      },
    });
if (!folio) {
  throw new Error('Folio not found');
}

    await this.prisma.folio.update({
      where: {
        id: data.folioId,
      },
      data: {
        balance: folio.balance - data.amount,
      },
    });

    return payment;
  }

  findAll() {
    return this.prisma.payment.findMany();
  }

  findOne(id: number) {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }
update(id: number, data: any) {
  return this.prisma.payment.update({
    where: { id },
    data,
  });
}
  remove(id: number) {
    return this.prisma.payment.delete({
      where: { id },
    });
  }
}