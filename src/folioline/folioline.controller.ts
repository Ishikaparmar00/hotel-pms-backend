import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FoliolineService } from './folioline.service';
import { CreateFoliolineDto } from './dto/create-folioline.dto';
import { UpdateFoliolineDto } from './dto/update-folioline.dto';

@Controller('folioline')
export class FoliolineController {
  constructor(private readonly foliolineService: FoliolineService) {}

  @Post()
  create(@Body() data: CreateFoliolineDto) {
    return this.foliolineService.create(data);
  }

  @Get()
  findAll() {
    return this.foliolineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foliolineService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateFoliolineDto) {
    return this.foliolineService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foliolineService.remove(+id);
  }
}