import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { Role } from '../roles/role.entity';
import { Company } from '../companies/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Company]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
