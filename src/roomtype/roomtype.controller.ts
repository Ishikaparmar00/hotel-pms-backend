import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { RoomtypeService } from './roomtype.service';
import { CreateRoomtypeDto } from './dto/create-roomtype.dto';
import { UpdateRoomtypeDto } from './dto/update-roomtype.dto';

@Controller('roomtype')
export class RoomtypeController {
  constructor(
    private readonly roomtypeService: RoomtypeService,
  ) {}

  @Post()
  create(@Body() data: any) {
    return this.roomtypeService.create(data);
  }

  @Get()
  findAll() {
    return this.roomtypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomtypeService.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.roomtypeService.update(
      Number(id),
      data,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomtypeService.remove(
      Number(id),
    );
  }
}