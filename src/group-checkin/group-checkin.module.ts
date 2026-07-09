import { Module } from '@nestjs/common';
import { GroupCheckinController } from './group-checkin.controller';
import { GroupCheckinService } from './group-checkin.service';

@Module({
  controllers: [GroupCheckinController],
  providers: [GroupCheckinService]
})
export class GroupCheckinModule {}
