import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryPoint } from './delivery-points.entity';
import { DeliveryPointsService } from './delivery-points.service';
import { DeliveryPointsController } from './delivery-points.controller';
import { Company } from '../companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryPoint, Company])],
  providers: [DeliveryPointsService],
  controllers: [DeliveryPointsController],
  exports: [DeliveryPointsService],
})
export class DeliveryPointsModule {}
