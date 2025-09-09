import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';

@Controller({ path: 'stocks', version: '1' })
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1000,
    @Query('keyword') keyword?: string,
    @Query('warehouseId') warehouseId?: number,
    @Query('stoneTypeId') stoneTypeId?: number,
  ) {
    return this.stocksService.findAll(page, limit, keyword, warehouseId, stoneTypeId);
  }

  @Post()
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.STOCK.CREATE)
  create(@Body() dto: CreateStockDto) {
    return this.stocksService.create(dto);
  }

  @Put(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.STOCK.UPDATE)
  update(@Param('id') id: number, @Body() dto: UpdateStockDto) {
    return this.stocksService.update(id, dto);
  }

  @Delete(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.STOCK.DELETE)
  delete(@Param('id') id: number) {
    return this.stocksService.delete(id);
  }
}
