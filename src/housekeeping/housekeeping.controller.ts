import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { HousekeepingService } from './housekeeping.service';
import { CreateHousekeepingDto } from './dto/create-housekeeping.dto';

@Controller('housekeeping')
export class HousekeepingController {
  constructor(private readonly service: HousekeepingService) {}

  @Post()
  create(@Body() dto: CreateHousekeepingDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string, 
    
    @Body() dto: CreateHousekeepingDto,
  ) {
    return this.service.update(Number(id), 
    dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}