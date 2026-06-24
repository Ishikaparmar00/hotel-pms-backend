import { Module } from '@nestjs/common';
import { RoomtypeController } from './roomtype.controller';
import { RoomtypeService } from './roomtype.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [RoomtypeController],
  providers: [RoomtypeService, PrismaService],
})
export class RoomtypeModule {}