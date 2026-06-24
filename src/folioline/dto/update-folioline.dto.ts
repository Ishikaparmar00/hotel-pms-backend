import { PartialType } from '@nestjs/mapped-types';
import { CreateFoliolineDto } from './create-folioline.dto';

export class UpdateFoliolineDto extends PartialType(
  CreateFoliolineDto,
) {}