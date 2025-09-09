import { Transform } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

export class EnterGateActivityDto {
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  licensePlate: string;
}
