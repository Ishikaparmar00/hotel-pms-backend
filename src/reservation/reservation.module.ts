import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}