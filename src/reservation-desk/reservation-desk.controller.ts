import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ReservationDeskService } from './reservation-desk.service';

@Controller('reservation-desk')
export class ReservationDeskController {
  constructor(private readonly deskService: ReservationDeskService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.deskService.getDashboardKpis();
  }

  @Get('arrivals')
  async getArrivals() {
    return this.deskService.getArrivals();
  }

  @Get('departures')
  async getDepartures() {
    return this.deskService.getDepartures();
  }

  @Get('stay-overs')
  async getStayOvers() {
    return this.deskService.getStayOvers();
  }

  @Get('search')
  async search(@Query('q') q: string) {
    if (!q || q.length < 2) return [];
    return this.deskService.searchReservations(q);
  }

  @Post('walk-in')
  async walkIn(@Body() data: any) {
    return this.deskService.walkInRegistration(data);
  }

  @Post('check-in/:id')
  async checkInReservation(@Param('id', ParseIntPipe) id: number, @Body() actionData: any) {
    return this.deskService.checkInReservation(id, actionData);
  }

  @Post('check-out/:id')
  async checkOutReservation(@Param('id', ParseIntPipe) id: number, @Body() actionData: any) {
    return this.deskService.checkOutReservation(id, actionData);
  }

  @Post('verify/:id')
  async verifyGuest(@Param('id', ParseIntPipe) id: number, @Body() actionData: any) {
    return this.deskService.verifyGuest(id, actionData);
  }
}
