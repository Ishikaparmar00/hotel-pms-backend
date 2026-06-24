import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FolioService } from './folio.service';
import { CreateFolioDto } from './dto/create-folio.dto';
import { UpdateFolioDto } from './dto/update-folio.dto';

@Controller('folio')
export class FolioController {
  constructor(private readonly folioService: FolioService) {}

  @Post()
  create(@Body() body: CreateFolioDto) {
    return this.folioService.create(body);
  }

  @Get()
  findAll() {
    return this.folioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.folioService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateFolioDto) {
    return this.folioService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folioService.remove(+id);
  }
}