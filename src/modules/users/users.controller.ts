import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 1000,
    @Query('keyword') keyword?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll(page, limit, keyword, role);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @Post()
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.USER.CREATE)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.USER.UPDATE)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  // @UseGuards(PermissionsGuard)
  //@Permissions(PERMISSIONS.USER.DELETE)
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
