import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

import { RoomsModule } from './rooms/rooms.module';
import { ReservationModule } from './reservation/reservation.module';
import { GuestModule } from './guest/guest.module';
import { BillingModule } from './billing/billing.module';
import { HousekeepingModule } from './housekeeping/housekeeping.module';
import { PropertyModule } from './property/property.module';
import { RoomtypeModule } from './roomtype/roomtype.module';
import { HotelroomModule } from './hotelroom/hotelroom.module';
import { RatePlanModule } from './rate-plan/rate-plan.module';
import { RoomBlockModule } from './roomblock/roomblock.module';
import { FolioModule } from './folio/folio.module';
import { FoliolineModule } from './folioline/folioline.module';
import { PaymentModule } from './payment/payment.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule,
    RoomsModule,
    ReservationModule,
    GuestModule,
    BillingModule,
    HousekeepingModule,
    PropertyModule,
    RoomtypeModule,
    HotelroomModule,
    RatePlanModule,
    RoomBlockModule,
    FolioModule,
    FoliolineModule,
    PaymentModule,
    MaintenanceModule,
    DashboardModule,
  ],
})
export class AppModule {}