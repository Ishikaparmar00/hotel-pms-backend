import { IncidentManagementModule } from "./maintenance/incident-management/incident-management.module";
import { Module } from '@nestjs/common';
import { HotelDiscoveryModule } from './hotel-discovery/hotel-discovery.module';
import { HotelMasterModule } from './hotel-master/hotel-master.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AddressModule } from './address/address.module';

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
import { GroupCheckinModule } from './group-checkin/group-checkin.module';
import { ReservationDeskModule } from './reservation-desk/reservation-desk.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    HotelMasterModule,
    HotelDiscoveryModule,
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
    IncidentManagementModule,
    DashboardModule,
    GroupCheckinModule,
    ReservationDeskModule,
    AuthModule,
    UsersModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}