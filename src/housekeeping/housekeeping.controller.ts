import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { HousekeepingService } from './housekeeping.service';

@Controller('housekeeping')
export class HousekeepingController {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  // --- STAFF ---
  @Get('staff')
  async getAllStaff() {
    return this.housekeepingService.getAllStaff();
  }

  @Post('staff')
  async createStaff(@Body() data: any) {
    return this.housekeepingService.createStaff(data);
  }

  @Put('staff/:id')
  async updateStaff(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.housekeepingService.updateStaff(id, data);
  }

  @Delete('staff/:id')
  async deleteStaff(@Param('id', ParseIntPipe) id: number) {
    return this.housekeepingService.deleteStaff(id);
  }

  // --- TASKS & ROOMS ---
  @Get('rooms/eligible')
  async getEligibleRooms() {
    return this.housekeepingService.getEligibleRooms();
  }

  @Get('tasks')
  async getAllTasks() {
    return this.housekeepingService.getAllTasks();
  }

  @Post('tasks')
  async createTask(@Body() data: any) {
    return this.housekeepingService.createTask(data);
  }

  @Put('tasks/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: { status: string; actionData?: any }
  ) {
    return this.housekeepingService.updateTaskStatus(id, payload.status, payload.actionData);
  }

  // --- ANALYTICS & DASHBOARD ---
  @Get('dashboard')
  async getDashboardMetrics() {
    return this.housekeepingService.getDashboardMetrics();
  }

  @Get('analytics')
  async getAnalytics() {
    return this.housekeepingService.getAnalytics();
  }
}