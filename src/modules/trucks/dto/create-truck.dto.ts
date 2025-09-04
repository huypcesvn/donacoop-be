import { IsString, IsOptional, MaxLength, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTruckDto {
  @IsString()
  @MaxLength(20)
  licensePlate: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  group?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  weighingMethod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  weighingPosition?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  allowedLoad?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @Type(() => Number)
  @IsInt()
  companyId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  driverId?: number | null;
}
