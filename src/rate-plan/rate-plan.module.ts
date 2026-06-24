import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RatePlanController } from './rate-plan.controller';
import { RatePlanService } from './rate-plan.service';

@Module({
  imports: [PrismaModule],
  controllers: [RatePlanController],
  providers: [RatePlanService],
})
export class RatePlanModule {}