import { IsString, IsOptional, MaxLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMachineryDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  account?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  password?: string;

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
