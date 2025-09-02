import { IsString, IsOptional, IsEmail, MaxLength, MinLength, IsPhoneNumber, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(110)
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
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

  // role ids
  @IsOptional()
  @IsArray()
  roles?: number[];
}
