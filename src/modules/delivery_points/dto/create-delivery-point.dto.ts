import { IsString, IsOptional, MaxLength, IsNumber, IsInt } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateDeliveryPointDto {
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distance?: number;

  @Type(() => Number)
  @IsInt()
  companyId: number;
}
