import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FoliolineController } from './folioline.controller';
import { FoliolineService } from './folioline.service';

@Module({
  imports: [PrismaModule],
  controllers: [FoliolineController],
  providers: [FoliolineService],
})
export class FoliolineModule {}