import { Module } from '@nestjs/common';
import { HotelMasterController } from './hotel-master.controller';
import { HotelMasterService } from './hotel-master.service';

@Module({
  controllers: [HotelMasterController],
  providers: [HotelMasterService],
  exports: [HotelMasterService],
})
export class HotelMasterModule {}
