import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsPhoneNumber('VN')
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
