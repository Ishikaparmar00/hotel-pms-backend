import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('Super Admin', 'Admin')
  @Get()
  async findAll(@Query('q') query?: string, @Query('role') role?: string, @Query('status') status?: string) {
    return this.usersService.findAll(query, role, status);
  }

  @Roles('Super Admin', 'Admin')
  @Post()
  async create(@Body() createUserDto: any, @Request() req: any) {
    return this.usersService.createUser(createUserDto, req.user);
  }

  @Roles('Super Admin', 'Admin')
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: any, @Request() req: any) {
    return this.usersService.updateUser(id, updateUserDto, req.user);
  }

  @Roles('Super Admin', 'Admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.usersService.deleteUser(id, req.user);
  }
}
