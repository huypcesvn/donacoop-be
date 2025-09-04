import { PartialType } from '@nestjs/mapped-types';
import { CreateStoneTypeDto } from './create-stone-type.dto';

export class UpdateStoneTypeDto extends PartialType(CreateStoneTypeDto) {}
