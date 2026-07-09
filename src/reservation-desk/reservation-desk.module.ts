import { Module } from '@nestjs/common';
import { ReservationDeskController } from './reservation-desk.controller';
import { ReservationDeskService } from './reservation-desk.service';

@Module({
  controllers: [ReservationDeskController],
  providers: [ReservationDeskService]
})
export class ReservationDeskModule {}
