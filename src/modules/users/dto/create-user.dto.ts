import { IsString, IsOptional, IsEmail, MaxLength, MinLength, IsPhoneNumber, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
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
  companyId?: number;

  // role ids
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  roles?: number[];
}
