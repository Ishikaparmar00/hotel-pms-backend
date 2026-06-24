import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { HotelroomService } from './hotelroom.service';
import { CreateHotelroomDto } from './dto/create-hotelroom.dto';
import { UpdateHotelroomDto } from './dto/update-hotelroom.dto';

@Controller('hotelroom')
export class HotelroomController {
  constructor(private readonly hotelroomService: HotelroomService) {}

  @Post()
  create(@Body() data: any) {
    return this.hotelroomService.create(data);
  }

  @Get()
  findAll() {
    return this.hotelroomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelroomService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.hotelroomService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelroomService.remove(+id);
  }
}