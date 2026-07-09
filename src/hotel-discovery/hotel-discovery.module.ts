import { Module } from '@nestjs/common';
import { HotelDiscoveryController } from './hotel-discovery.controller';
import { HotelDiscoveryService } from './hotel-discovery.service';
import { HotelDiscoveryGateway } from './hotel-discovery.gateway';

@Module({
  controllers: [HotelDiscoveryController],
  providers: [HotelDiscoveryService, HotelDiscoveryGateway],
  exports: [HotelDiscoveryService],
})
export class HotelDiscoveryModule {}
