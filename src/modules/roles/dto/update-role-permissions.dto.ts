import { IsArray, IsOptional } from 'class-validator';

export class UpdateRolePermissionsDto {
  @IsOptional()
  @IsArray()
  permissionIds: number[];
}
