import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('countries')
  async getCountries() {
    return this.addressService.getCountries();
  }

  @Post('countries')
  async addCountry(@Body('name') name: string) {
    return this.addressService.addCountry(name);
  }

  @Get('states')
  async getStates(@Query('countryId', ParseIntPipe) countryId: number) {
    return this.addressService.getStates(countryId);
  }

  @Post('states')
  async addState(@Body('name') name: string, @Body('countryId', ParseIntPipe) countryId: number) {
    return this.addressService.addState(name, countryId);
  }

  @Get('cities')
  async getCities(@Query('stateId', ParseIntPipe) stateId: number) {
    return this.addressService.getCities(stateId);
  }

  @Post('cities')
  async addCity(@Body('name') name: string, @Body('stateId', ParseIntPipe) stateId: number) {
    return this.addressService.addCity(name, stateId);
  }
}
