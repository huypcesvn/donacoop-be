import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

@Controller({ path: 'trucks', version: '1' })
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
    @Query('companyId') companyId?: number,
    @Query('driverId') driverId?: number,
  ) {
    return this.trucksService.findAll(page, limit, keyword, companyId, driverId);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.TRUCK.CREATE)
  create(@Body() dto: CreateTruckDto) {
    return this.trucksService.create(dto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.TRUCK.UPDATE)
  update(@Param('id') id: number, @Body() dto: UpdateTruckDto) {
    return this.trucksService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.TRUCK.DELETE)
  delete(@Param('id') id: number) {
    return this.trucksService.delete(id);
  }
}
