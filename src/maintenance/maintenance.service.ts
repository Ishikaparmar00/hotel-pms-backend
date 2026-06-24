import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async getEngineers() {
    return this.prisma.engineer.findMany();
  }

  async getWorkOrders() {
    return this.prisma.workOrder.findMany({
      orderBy: { dateCreated: 'desc' }
    });
  }

  async createWorkOrder(data: any) {
    return this.prisma.workOrder.create({ data });
  }

  async updateWorkOrder(id: number, data: any) {
    return this.prisma.workOrder.update({
      where: { id },
      data
    });
  }
}
