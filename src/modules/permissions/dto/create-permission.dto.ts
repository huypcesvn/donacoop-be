import { IsString, MaxLength } from "class-validator";

export class CreatePermissionDto {
  @IsString()
  @MaxLength(50)
  resource: string;

  @IsString()
  @MaxLength(50)
  action: string;
}
