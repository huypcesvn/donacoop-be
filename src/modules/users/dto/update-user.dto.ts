import { IsString, IsOptional, IsEmail, MaxLength, MinLength, IsPhoneNumber, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(110)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  currentJob?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  personalEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  personalPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  // relationship: company
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  companyId?: number | null;

  // role ids
  @IsOptional()
  @IsArray()
  roles?: number[];
}
