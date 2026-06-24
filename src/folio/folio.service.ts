import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FolioService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.folio.create({
      data,
    });
  }

  findAll() {
    return this.prisma.folio.findMany();
  }

  findOne(id: number) {
    return this.prisma.folio.findUnique({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.folio.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.folio.delete({
      where: { id },
    });
  }
}