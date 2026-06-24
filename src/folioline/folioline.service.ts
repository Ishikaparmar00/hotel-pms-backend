import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoliolineService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {

  const folio = await this.prisma.folio.findUnique({
    where: {
      id: data.folioId,
    },
  });

  if (!folio) {
    throw new Error('Folio not found');
  }

  const folioLine = await this.prisma.folioLine.create({
    data,
  });

  await this.prisma.folio.update({
    where: {
      id: data.folioId,
    },
    data: {
      balance: folio.balance + data.amount,
    },
  });

  return folioLine;
}

  findAll() {
    return this.prisma.folioLine.findMany();
  }

  findOne(id: number) {
    return this.prisma.folioLine.findUnique({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.folioLine.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.folioLine.delete({
      where: { id },
    });
  }
}