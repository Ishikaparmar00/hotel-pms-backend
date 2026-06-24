import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { RoomBlockService } from './roomblock.service';

@Controller('roomblock')
export class RoomBlockController {
  constructor(private readonly roomBlockService: RoomBlockService) {}

  @Post()
  create(@Body() body: any) {
    return this.roomBlockService.create(body);
  }

  @Get()
  findAll() {
    return this.roomBlockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomBlockService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.roomBlockService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomBlockService.remove(+id);
  }
}