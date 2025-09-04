import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { Registration } from './registration.entity';
import { Truck } from '../trucks/truck.entity';
import { StoneType } from '../stone_types/stone-type.entity';
import { Machinery } from '../machineries/machinery.entity';
import { Company } from '../companies/company.entity';
import { DeliveryPoint } from '../delivery_points/delivery-points.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Truck, StoneType, Machinery, Company, DeliveryPoint, Warehouse])],
  providers: [RegistrationsService],
  controllers: [RegistrationsController],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}
