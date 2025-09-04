import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constant';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller({ path: 'companies', version: '1' })
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.companiesService.findAll(page, limit, keyword);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.COMPANY.CREATE)
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.COMPANY.UPDATE)
  update(@Param('id') id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions(PERMISSIONS.COMPANY.DELETE)
  delete(@Param('id') id: number) {
    return this.companiesService.delete(id);
  }
}
