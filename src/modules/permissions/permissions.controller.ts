import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller({ path: 'permissions', version: '1' })
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Post()
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.PERMISSION.CREATE)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Delete(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.PERMISSION.DELETE)
  delete(@Param('id') id: number) {
    return this.permissionsService.delete(id);
  }
}
