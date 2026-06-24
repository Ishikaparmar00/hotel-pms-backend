import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { RatePlanService } from './rate-plan.service';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';

@Controller('rate-plan')
export class RatePlanController {
  constructor(private readonly ratePlanService: RatePlanService) {}

  @Post()
  create(@Body() body: any) {
    return this.ratePlanService.create(body);
  }

  @Get()
  findAll() {
    return this.ratePlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratePlanService.findOne(Number(id));
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.ratePlanService.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ratePlanService.delete(Number(id));
  }
}
