import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('work-orders')
  getWorkOrders() {
    return this.maintenanceService.getWorkOrders();
  }

  @Get('engineers')
  getEngineers() {
    return this.maintenanceService.getEngineers();
  }

  @Post('work-orders')
  createWorkOrder(@Body() data: any) {
    return this.maintenanceService.createWorkOrder(data);
  }

  @Put('work-orders/:id')
  updateWorkOrder(@Param('id') id: string, @Body() data: any) {
    return this.maintenanceService.updateWorkOrder(+id, data);
  }
}
