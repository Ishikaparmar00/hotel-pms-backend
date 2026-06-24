import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Controller('guest')
export class GuestController {
  constructor(
    private readonly guestService: GuestService,
  ) {}

  @Get()
  findAll() {
    return this.guestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: CreateGuestDto) {
    return this.guestService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateGuestDto,
  ) {
    return this.guestService.update(
      Number(id),
      data,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestService.remove(Number(id));
  }
}