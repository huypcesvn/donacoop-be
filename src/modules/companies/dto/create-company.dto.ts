import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, MaxLength, IsEmail, ValidateNested, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  city?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  postalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  type?: string; // seller, buyer, other

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryPointForCompanyDto)
  deliveryPoints?: CreateDeliveryPointForCompanyDto[];
}

export class CreateDeliveryPointForCompanyDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distance?: number;
}
