import { IsOptional, IsString, IsInt, IsNumber, MaxLength, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { RegistrationStatus } from '../registration.entity';

export class CreateRegistrationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tripNumber?: number;

  @IsOptional()
  arrivalDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  arrivalTime?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  revenueType?: string;

  @IsOptional()
  @IsEnum(RegistrationStatus)
  registrationStatus?: RegistrationStatus;

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
  destinationId?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  originWarehouseId?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  destinationWarehouseId?: number | null;
}
