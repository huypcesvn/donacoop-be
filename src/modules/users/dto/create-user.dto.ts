import { IsString, IsOptional, IsEmail, MaxLength, MinLength, IsPhoneNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsPhoneNumber('VN')
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
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

  // role ids
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  roles?: number[];
}
