import { Module } from '@nestjs/common';
import { IncidentManagementController } from './incident-management.controller';
import { IncidentManagementService } from './incident-management.service';

@Module({
  controllers: [IncidentManagementController],
  providers: [IncidentManagementService],
  exports: [IncidentManagementService]
})
export class IncidentManagementModule {}
