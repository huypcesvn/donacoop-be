import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActivityDto {
  @IsOptional()
  gateInTime?: Date;

  @IsOptional()
  weighTime1?: Date;

  @IsOptional()
  @IsString()
  weighPosition1?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight1?: number;

  @IsOptional()
  weighTime2?: Date;

  @IsOptional()
  @IsString()
  weighPosition2?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight2?: number;

  @IsOptional()
  gateOutTime?: Date;

  @IsOptional()
  @IsString()
  weighingPosition?: string;

  @IsOptional()
  @IsString()
  revenueType?: string;

  @Type(() => Number)
  @IsInt()
  truckId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stoneTypeId?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pickupPositionId?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  buyerCompanyId?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  registrationId?: number | null;
}
