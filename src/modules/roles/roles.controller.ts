import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller({ path: 'roles', version: '1' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
