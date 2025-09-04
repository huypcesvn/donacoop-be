import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './db/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesModule } from './modules/roles/roles.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { StoneTypesModule } from './modules/stone_types/stone-types.module';
import { TrucksModule } from './modules/trucks/trucks.module';
import { MachineriesModule } from './modules/machineries/machineries.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { DeliveryPointsModule } from './modules/delivery_points/delivery-points.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { ActivitiesModule } from './modules/activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    UsersModule,
    RolesModule,
    CompaniesModule,
    StoneTypesModule,
    TrucksModule,
    MachineriesModule,
    WarehousesModule,
    DeliveryPointsModule,
    StocksModule,
    RegistrationsModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { // Enable authentication globally
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
