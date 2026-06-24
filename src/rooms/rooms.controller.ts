import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { RoomService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() data: CreateRoomDto) {
    return this.roomService.create(data);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateRoomDto,
  ) {
    return this.roomService.update(
      Number(id),
      data,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(Number(id));
  }
}