import { Module } from '@nestjs/common';
import { RoomController } from './rooms.controller';
import { RoomService } from './rooms.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomsModule {}
