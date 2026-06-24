import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomblockDto } from './create-roomblock.dto';

export class UpdateRoomblockDto extends PartialType(CreateRoomblockDto) {}