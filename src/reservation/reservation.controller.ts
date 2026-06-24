import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
  ) {}

  @Get()
  getAll() {
    return this.reservationService.findAll();
  }
@Get('availability/check')
checkAvailability(
  @Query('roomId') roomId: string,
  @Query('checkIn') checkIn: string,
  @Query('checkOut') checkOut: string,
) {
  return this.reservationService.checkAvailability(
    Number(roomId),
    checkIn,
    checkOut,
  );
}

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.reservationService.findOne(Number(id));
  }

  @Post()
  create(@Body() data: CreateReservationDto) {
    return this.reservationService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateReservationDto,
  ) {
    return this.reservationService.update(
      Number(id),
      data,
    );
  }
@Post(':id/checkin')
checkin(@Param('id') id: string) {
  return this.reservationService.checkin(
    Number(id),
  );
}

  @Post(':id/checkout')
checkout(@Param('id') id: string) {
  return this.reservationService.checkout(
    Number(id),
  );
}
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(Number(id));
  }
}