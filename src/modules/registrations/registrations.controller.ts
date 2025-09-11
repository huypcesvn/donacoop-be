import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

@Controller({ path: 'registrations', version: '1' })
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1000,
    @Query('keyword') keyword?: string,
    @Query('truckId') truckId?: number,
    @Query('buyerCompanyId') buyerCompanyId?: number,
  ) {
    return this.registrationsService.findAll(page, limit, keyword, truckId, buyerCompanyId);
  }

  @Post()
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.TRUCK_REGISTRATION.CREATE)
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrationsService.create(dto);
  }

  @Put(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.TRUCK_REGISTRATION.UPDATE)
  update(@Param('id') id: number, @Body() dto: UpdateRegistrationDto) {
    return this.registrationsService.update(id, dto);
  }

  @Delete(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.TRUCK_REGISTRATION.DELETE)
  delete(@Param('id') id: number) {
    return this.registrationsService.delete(id);
  }
}
