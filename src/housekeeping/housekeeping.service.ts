import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHousekeepingDto } from './dto/create-housekeeping.dto';

@Injectable()
export class HousekeepingService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateHousekeepingDto) {
    return this.prisma.housekeeping.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.housekeeping.findMany();
  }

  findOne(id: number) {
    return this.prisma.housekeeping.findUnique({
      where: { id },
    });
  }

  update(id: number, dto: CreateHousekeepingDto) {
    return this.prisma.housekeeping.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.housekeeping.delete({
      where: { id },
    });
  }
}