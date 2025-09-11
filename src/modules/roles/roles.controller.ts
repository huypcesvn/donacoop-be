import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

@Controller({ path: 'roles', version: '1' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rolesService.findOne(id);
  }

  @Post()
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.ROLE.CREATE)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.ROLE.UPDATE)
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.ROLE.DELETE)
  delete(@Param('id') id: number) {
    return this.rolesService.delete(id);
  }

  // update permissions for role
  @Put(':id/permissions')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.ROLE.UPDATE)
  updatePermissions(@Param('id') id: number, @Body() updateRolePermissionsDto: UpdateRolePermissionsDto) {
    return this.rolesService.updatePermissions(id, updateRolePermissionsDto.permissionIds);
  }
}
