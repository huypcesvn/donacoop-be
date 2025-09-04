import { IsString, IsOptional, MaxLength, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeliveryPointDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distance?: number;

  @Type(() => Number)
  @IsInt()
  companyId: number;
}
