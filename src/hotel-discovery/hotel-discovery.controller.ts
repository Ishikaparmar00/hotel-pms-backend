import { Controller, Get, Param, Query } from '@nestjs/common';
import { HotelDiscoveryService } from './hotel-discovery.service';

@Controller('api/v1/hotel-discovery')
export class HotelDiscoveryController {
  constructor(private readonly discoveryService: HotelDiscoveryService) {}

  @Get('search')
  async search(@Query() query: any) {
    return this.discoveryService.searchHotels(query);
  }

  @Get('recommendations')
  async getRecommendations() {
    // Just re-use search with a top-N limit for now
    const hotels = await this.discoveryService.searchHotels({});
    return hotels.slice(0, 3);
  }

  @Get('compare')
  async compare(@Query('ids') ids: string) {
    const idArray = ids.split(',').map(id => parseInt(id, 10));
    return this.discoveryService.compareHotels(idArray);
  }

  @Get(':id')
  async getHotel(@Param('id') id: string) {
    return this.discoveryService.getHotelDetails(parseInt(id, 10));
  }

  @Get(':id/rooms')
  async getRooms(@Param('id') id: string) {
    return this.discoveryService.getHotelRooms(parseInt(id, 10));
  }
}
