import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { IncidentManagementService } from './incident-management.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('maintenance/incidents')
@UseGuards(RolesGuard) // In a real app this would use JwtAuthGuard + RolesGuard
export class IncidentManagementController {
  constructor(private readonly incidentService: IncidentManagementService) {}

  @Post()
  // @Roles('Admin', 'Super Admin', 'Engineer', 'Front Desk')
  async createIncident(@Body() data: any, @Request() req: any) {
    // Mock user if auth isn't fully wired in this execution context
    const requestor = req.user || { id: 1, fullName: 'System Admin' };
    return this.incidentService.createIncident(data, requestor);
  }

  @Get()
  async getAllIncidents(@Query() query: any) {
    return this.incidentService.getAllIncidents(query);
  }

  @Get('dashboard')
  async getDashboardAnalytics() {
    return this.incidentService.getDashboardAnalytics();
  }

  @Get('analytics')
  async getAnalytics() {
    // Basic placeholder for deep analytics charts, extending dashboard stats for now
    return this.incidentService.getDashboardAnalytics();
  }

  @Get(':id')
  async getIncidentById(@Param('id') id: string) {
    return this.incidentService.getIncidentById(Number(id));
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string; notes: string }, @Request() req: any) {
    const requestor = req.user || { id: 1, fullName: 'System Admin' };
    return this.incidentService.updateStatus(Number(id), body.status, body.notes, requestor);
  }

  @Post(':id/assign')
  async assignEngineer(@Param('id') id: string, @Body() body: { engineerId: number }, @Request() req: any) {
    const requestor = req.user || { id: 1, fullName: 'System Admin' };
    return this.incidentService.assignEngineer(Number(id), body.engineerId, requestor);
  }

  @Post(':id/resolve')
  async resolveIncident(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const requestor = req.user || { id: 1, fullName: 'System Admin' };
    return this.incidentService.resolveIncident(Number(id), body, requestor);
  }

  @Post(':id/cost')
  async addCost(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const requestor = req.user || { id: 1, fullName: 'System Admin' };
    return this.incidentService.addCost(Number(id), body, requestor);
  }
}
