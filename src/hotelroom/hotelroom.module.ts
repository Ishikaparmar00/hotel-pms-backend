import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HotelroomController } from './hotelroom.controller';
import { HotelroomService } from './hotelroom.service';

@Module({
  imports: [PrismaModule],
  controllers: [HotelroomController],
  providers: [HotelroomService],
})
export class HotelroomModule {}