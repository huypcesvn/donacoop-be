import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from './truck.entity';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TrucksService {
  constructor(
    @InjectRepository(Truck) private truckRepository: Repository<Truck>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    keyword?: string,
    companyId?: number,
    driverId?: number,
  ) {
    const skip = (page - 1) * limit;
    const qb = this.truckRepository
      .createQueryBuilder('truck')
      .leftJoinAndSelect('truck.company', 'company')
      .leftJoinAndSelect('truck.driver', 'driver')
      .orderBy('truck.id', 'ASC')
      .addOrderBy('truck.licensePlate', 'ASC');

    if (keyword) {
      qb.where(
        'truck.licensePlate ILIKE :keyword OR truck.code ILIKE :keyword OR truck.type ILIKE :keyword OR truck.group ILIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }
    if (companyId) qb.andWhere('company.id = :companyId', { companyId });
    if (driverId) qb.andWhere('driver.id = :driverId', { driverId });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateTruckDto) {
    const company = await this.companyRepository.findOne({ where: { id: dto.companyId } });
    if (!company) throw new BadRequestException('Company not found');

    const driver = dto.driverId ? await this.userRepository.findOne({ where: { id: dto.driverId } }) : undefined;

    const entity = this.truckRepository.create({
      licensePlate: dto.licensePlate,
      code: dto.code,
      type: dto.type,
      group: dto.group,
      weighingMethod: dto.weighingMethod,
      weighingPosition: dto.weighingPosition,
      allowedLoad: dto.allowedLoad,
      description: dto.description,
      company,
      ...(driver !== undefined ? { driver } : {}),
    });
    return this.truckRepository.save(entity);
  }

  async update(id: number, dto: UpdateTruckDto) {
    const entity = await this.truckRepository.findOne({ where: { id }, relations: ['company', 'driver'] });
    if (!entity) throw new BadRequestException('Truck not found');

    if (dto.companyId) {
      const company = await this.companyRepository.findOne({ where: { id: dto.companyId } });
      if (!company) throw new BadRequestException('Company not found');
      entity.company = company;
    }

    if (dto.driverId !== undefined) {
      if (dto.driverId === null) {
        entity.driver = null;
      } else {
        const driver = await this.userRepository.findOne({ where: { id: dto.driverId } });
        if (!driver) throw new BadRequestException('Driver not found');
        entity.driver = driver;
      }
    }

    Object.assign(entity, {
      licensePlate: dto.licensePlate ?? entity.licensePlate,
      code: dto.code ?? entity.code,
      type: dto.type ?? entity.type,
      group: dto.group ?? entity.group,
      weighingMethod: dto.weighingMethod ?? entity.weighingMethod,
      weighingPosition: dto.weighingPosition ?? entity.weighingPosition,
      allowedLoad: dto.allowedLoad ?? entity.allowedLoad,
      description: dto.description ?? entity.description,
    });
    return this.truckRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.truckRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Truck not found');
    await this.truckRepository.remove(entity);
    return { message: `Truck ${id} deleted.` };
  }
}
