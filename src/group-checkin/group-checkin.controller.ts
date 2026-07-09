import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { GroupCheckinService } from './group-checkin.service';

@Controller('group-checkin')
export class GroupCheckinController {
  constructor(private readonly groupCheckinService: GroupCheckinService) {}

  // --- GROUPS ---
  @Get('groups')
  async getAllGroups() {
    return this.groupCheckinService.getAllGroups();
  }

  @Get('groups/:id')
  async getGroupById(@Param('id', ParseIntPipe) id: number) {
    return this.groupCheckinService.getGroupById(id);
  }

  @Post('groups')
  async createGroup(@Body() data: any) {
    return this.groupCheckinService.createGroup(data);
  }

  @Put('groups/:id')
  async updateGroup(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.groupCheckinService.updateGroup(id, data);
  }

  @Delete('groups/:id')
  async deleteGroup(@Param('id', ParseIntPipe) id: number) {
    return this.groupCheckinService.deleteGroup(id);
  }

  // --- GUESTS ---
  @Get('groups/:id/guests')
  async getGroupGuests(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupCheckinService.getGroupGuests(groupId);
  }

  @Post('groups/:id/guests')
  async addGuest(@Param('id', ParseIntPipe) groupId: number, @Body() data: any) {
    return this.groupCheckinService.addGuest(groupId, data);
  }

  @Put('guests/:id')
  async updateGuest(@Param('id', ParseIntPipe) guestId: number, @Body() data: any) {
    return this.groupCheckinService.updateGuest(guestId, data);
  }

  @Delete('guests/:id')
  async deleteGuest(@Param('id', ParseIntPipe) guestId: number) {
    return this.groupCheckinService.deleteGuest(guestId);
  }

  // --- BULK ACTIONS & IMPORT ---
  @Post('groups/:id/guests/import')
  async bulkImportGuests(@Param('id', ParseIntPipe) groupId: number, @Body() guestsData: any[]) {
    return this.groupCheckinService.bulkImportGuests(groupId, guestsData);
  }

  @Post('groups/:id/guests/bulk-action')
  async bulkActionGuests(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() payload: { action: string; guestIds: number[]; actionData?: any }
  ) {
    return this.groupCheckinService.bulkActionGuests(groupId, payload.action, payload.guestIds, payload.actionData);
  }
}
