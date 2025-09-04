import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

@Controller({ path: 'activities', version: '1' })
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
    @Query('truckId') truckId?: number,
  ) {
    return this.activitiesService.findAll(page, limit, keyword, truckId);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.ACTIVITY_TRACKING.CREATE)
  create(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.ACTIVITY_TRACKING.UPDATE)
  update(@Param('id') id: number, @Body() dto: UpdateActivityDto) {
    return this.activitiesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.ACTIVITY_TRACKING.DELETE)
  delete(@Param('id') id: number) {
    return this.activitiesService.delete(id);
  }
}
