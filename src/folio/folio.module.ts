import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FolioController } from './folio.controller';
import { FolioService } from './folio.service';

@Module({
  imports: [PrismaModule],
  controllers: [FolioController],
  providers: [FolioService],
})
export class FolioModule {}