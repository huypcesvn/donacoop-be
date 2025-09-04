import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machinery } from './machinery.entity';
import { CreateMachineryDto } from './dto/create-machinery.dto';
import { UpdateMachineryDto } from './dto/update-machinery.dto';
import { Company } from '../companies/company.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MachineriesService {
  constructor(
    @InjectRepository(Machinery) private machineryRepository: Repository<Machinery>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string, companyId?: number, driverId?: number) {
    const skip = (page - 1) * limit;
    const qb = this.machineryRepository
      .createQueryBuilder('machinery')
      .leftJoinAndSelect('machinery.company', 'company')
      .leftJoinAndSelect('machinery.driver', 'driver')
      .orderBy('machinery.id', 'ASC')
      .addOrderBy('machinery.name', 'ASC');

    if (keyword) qb.where('machinery.name ILIKE :keyword OR machinery.account ILIKE :keyword', { keyword: `%${keyword}%` });
    if (companyId) qb.andWhere('company.id = :companyId', { companyId });
    if (driverId) qb.andWhere('driver.id = :driverId', { driverId });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateMachineryDto) {
    const company = await this.companyRepository.findOne({ where: { id: dto.companyId } });
    if (!company) throw new BadRequestException('Company not found');
    const driver = dto.driverId ? await this.userRepository.findOne({ where: { id: dto.driverId } }) : undefined;

    const entityData: any = {
      name: dto.name,
      account: dto.account,
      password: dto.password,
      description: dto.description,
      company,
    };
    if (driver !== undefined) entityData.driver = driver;
    const entity = this.machineryRepository.create(entityData);
    return this.machineryRepository.save(entity);
  }

  async update(id: number, dto: UpdateMachineryDto) {
    const entity = await this.machineryRepository.findOne({ where: { id }, relations: ['company', 'driver'] });
    if (!entity) throw new BadRequestException('Machinery not found');

    if (dto.companyId) {
      const company = await this.companyRepository.findOne({ where: { id: dto.companyId } });
      if (!company) throw new BadRequestException('Company not found');
      entity.company = company;
    }

    if (dto.driverId !== undefined) {
      if (dto.driverId === null) {
        (entity as any).driver = null;
      } else {
        const driver = await this.userRepository.findOne({ where: { id: dto.driverId } });
        if (!driver) throw new BadRequestException('Driver not found');
        (entity as any).driver = driver;
      }
    }

    Object.assign(entity, {
      name: dto.name ?? entity.name,
      account: dto.account ?? entity.account,
      password: dto.password ?? entity.password,
      description: dto.description ?? entity.description,
    });
    return this.machineryRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.machineryRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Machinery not found');
    await this.machineryRepository.remove(entity);
    return { message: `Machinery ${id} deleted.` };
  }
}
