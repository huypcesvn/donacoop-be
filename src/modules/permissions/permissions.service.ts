import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {}

  findAll() {
    return this.permissionRepository.find();
  }

  create(createPermissionDto: CreatePermissionDto) {
    const perm = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(perm);
  }

  async delete(id: number) {
    const perm = await this.permissionRepository.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('Permission not found');
    return this.permissionRepository.remove(perm);
  }
}
