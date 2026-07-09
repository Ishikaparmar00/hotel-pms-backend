import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { HotelMasterService } from './hotel-master.service';

@Controller('hotel-master')
export class HotelMasterController {
  constructor(private readonly hotelMasterService: HotelMasterService) {}

  @Get('search')
  searchHotels(@Query() query: any) {
    return this.hotelMasterService.searchHotels(query);
  }

  @Get('dashboard')
  async getDashboard() {
    return this.hotelMasterService.getDashboardStats();
  }

  @Get('categories')
  async getCategories() {
    return this.hotelMasterService.getCategories();
  }

  @Post('categories')
  async createCategory(@Body() data: any) {
    return this.hotelMasterService.createCategory(data);
  }

  @Get()
  async getHotels(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string
  ) {
    return this.hotelMasterService.getHotels(
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 10,
      search
    );
  }

  @Get(':id')
  async getHotel(@Param('id', ParseIntPipe) id: number) {
    return this.hotelMasterService.getHotelById(id);
  }

  @Post()
  async createHotel(@Body() data: any) {
    return this.hotelMasterService.createHotel(data);
  }

  @Put(':id')
  async updateHotel(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.hotelMasterService.updateHotel(id, data);
  }

  @Delete(':id')
  async deleteHotel(@Param('id', ParseIntPipe) id: number) {
    return this.hotelMasterService.deleteHotel(id);
  }

  // Room Types
  @Post(':id/room-types')
  async addRoomType(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.hotelMasterService.addRoomType(id, data);
  }

  @Put('room-types/:rtId')
  async updateRoomType(@Param('rtId', ParseIntPipe) rtId: number, @Body() data: any) {
    return this.hotelMasterService.updateRoomType(rtId, data);
  }

  @Delete('room-types/:rtId')
  async deleteRoomType(@Param('rtId', ParseIntPipe) rtId: number) {
    return this.hotelMasterService.deleteRoomType(rtId);
  }

  // Restaurants
  @Post(':id/restaurants')
  async addRestaurant(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.hotelMasterService.addRestaurant(id, data);
  }

  @Put('restaurants/:rId')
  async updateRestaurant(@Param('rId', ParseIntPipe) rId: number, @Body() data: any) {
    return this.hotelMasterService.updateRestaurant(rId, data);
  }

  @Delete('restaurants/:rId')
  async deleteRestaurant(@Param('rId', ParseIntPipe) rId: number) {
    return this.hotelMasterService.deleteRestaurant(rId);
  }
}
