import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineriesService } from './machineries.service';
import { MachineriesController } from './machineries.controller';
import { Machinery } from './machinery.entity';
import { Company } from '../companies/company.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Machinery, Company, User])],
  providers: [MachineriesService],
  controllers: [MachineriesController],
  exports: [MachineriesService],
})
export class MachineriesModule {}
