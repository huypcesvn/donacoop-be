import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StoneTypesService } from './stone-types.service';
import { CreateStoneTypeDto } from './dto/create-stone-type.dto';
import { UpdateStoneTypeDto } from './dto/update-stone-type.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

@Controller({ path: 'stone_types', version: '1' })
export class StoneTypesController {
  constructor(private readonly stoneTypesService: StoneTypesService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1000,
    @Query('keyword') keyword?: string,
  ) {
    return this.stoneTypesService.findAll(page, limit, keyword);
  }

  @Post()
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.STONE_TYPE.CREATE)
  create(@Body() dto: CreateStoneTypeDto) {
    return this.stoneTypesService.create(dto);
  }

  @Put(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.STONE_TYPE.UPDATE)
  update(@Param('id') id: number, @Body() dto: UpdateStoneTypeDto) {
    return this.stoneTypesService.update(id, dto);
  }

  @Delete(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.STONE_TYPE.DELETE)
  delete(@Param('id') id: number) {
    return this.stoneTypesService.delete(id);
  }
}
