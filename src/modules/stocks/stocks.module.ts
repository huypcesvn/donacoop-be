import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { Stock } from './stock.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { StoneType } from '../stone_types/stone-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Warehouse, StoneType])],
  providers: [StocksService],
  controllers: [StocksController],
  exports: [StocksService],
})
export class StocksModule {}
