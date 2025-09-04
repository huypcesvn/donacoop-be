import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DeliveryPointsService } from './delivery-points.service';
import { CreateDeliveryPointDto } from './dto/create-delivery-point.dto';
import { UpdateDeliveryPointDto } from './dto/update-delivery-point.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

@Controller({ path: 'delivery_points', version: '1' })
export class DeliveryPointsController {
  constructor(private readonly deliveryPointsService: DeliveryPointsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
    @Query('companyId') companyId?: number,
  ) {
    return this.deliveryPointsService.findAll(page, limit, keyword, companyId);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.DELIVERY_POINT.CREATE)
  create(@Body() dto: CreateDeliveryPointDto) {
    return this.deliveryPointsService.create(dto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.DELIVERY_POINT.UPDATE)
  update(@Param('id') id: number, @Body() dto: UpdateDeliveryPointDto) {
    return this.deliveryPointsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.DELIVERY_POINT.DELETE)
  delete(@Param('id') id: number) {
    return this.deliveryPointsService.delete(id);
  }
}
