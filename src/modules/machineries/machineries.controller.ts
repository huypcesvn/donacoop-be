import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MachineriesService } from './machineries.service';
import { CreateMachineryDto } from './dto/create-machinery.dto';
import { UpdateMachineryDto } from './dto/update-machinery.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

@Controller({ path: 'machineries', version: '1' })
export class MachineriesController {
  constructor(private readonly machineriesService: MachineriesService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1000,
    @Query('keyword') keyword?: string,
    @Query('companyId') companyId?: number,
    @Query('driverId') driverId?: number,
  ) {
    return this.machineriesService.findAll(page, limit, keyword, companyId, driverId);
  }

  @Post()
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.MACHINE.CREATE)
  create(@Body() dto: CreateMachineryDto) {
    return this.machineriesService.create(dto);
  }

  @Put(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.MACHINE.UPDATE)
  update(@Param('id') id: number, @Body() dto: UpdateMachineryDto) {
    return this.machineriesService.update(id, dto);
  }

  @Delete(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.MACHINE.DELETE)
  delete(@Param('id') id: number) {
    return this.machineriesService.delete(id);
  }
}
