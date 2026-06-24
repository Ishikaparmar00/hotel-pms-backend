import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  create(@Body() data: CreateBillingDto) {
    return this.billingService.create(data);
  }

  @Get()
  findAll() {
    return this.billingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateBillingDto) {
    return this.billingService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingService.remove(+id);
  }
}