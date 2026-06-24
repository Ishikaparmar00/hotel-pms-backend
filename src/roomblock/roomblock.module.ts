import { Module } from '@nestjs/common';
import { RoomBlockController } from './roomblock.controller';
import { RoomBlockService } from './roomblock.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoomBlockController],
  providers: [RoomBlockService],
})
export class RoomBlockModule {}