import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  getWorkOrders() {
    return this.prisma.workOrder.findMany({ orderBy: { dateCreated: 'desc' } });
  }

  getEngineers() {
    return this.prisma.engineer.findMany();
  }

  createWorkOrder(data: any) {
    return this.prisma.workOrder.create({ data });
  }

  updateWorkOrder(id: number, data: any) {
    return this.prisma.workOrder.update({ where: { id }, data });
  }
}
