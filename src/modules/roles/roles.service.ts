import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './role.entity';
import { Permission } from '../permissions/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
  ) {}

  findAll() {
    return this.roleRepository.find({
      relations: ['permissions'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found.');
    return role;
  }

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async delete(id: number) {
    const role = await this.findOne(id);
    return this.roleRepository.remove(role);
  }

  async updatePermissions(id: number, permissionIds: number[]) {
    const role = await this.findOne(id);
    const permissions = await this.permissionRepository.findBy({ id: In(permissionIds) });
    role.permissions = permissions;
    return this.roleRepository.save(role);
  }
}
