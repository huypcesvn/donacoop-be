import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoneType } from './stone-type.entity';
import { StoneTypesService } from './stone-types.service';
import { StoneTypesController } from './stone-types.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoneType])],
  providers: [StoneTypesService],
  controllers: [StoneTypesController],
  exports: [StoneTypesService],
})
export class StoneTypesModule {}
