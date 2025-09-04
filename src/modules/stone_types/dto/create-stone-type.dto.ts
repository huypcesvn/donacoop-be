import { IsString, MaxLength } from 'class-validator';

export class CreateStoneTypeDto {
  @IsString()
  @MaxLength(255)
  name: string;
}
