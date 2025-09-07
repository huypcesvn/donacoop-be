import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse) private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string, companyId?: number) {
    const skip = (page - 1) * limit;
    const qb = this.warehouseRepository
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.company', 'company')
      .leftJoinAndSelect('warehouse.stocks', 'stocks')
      .leftJoinAndSelect('stocks.stoneType', 'stoneType')
      .orderBy('warehouse.id', 'ASC')
      .addOrderBy('warehouse.name', 'ASC');

    if (keyword) qb.where('warehouse.name ILIKE :keyword', { keyword: `%${keyword}%` });
    if (companyId) qb.andWhere('company.id = :companyId', { companyId });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateWarehouseDto) {
    const company = dto.companyId
      ? await this.companyRepository.findOne({ where: { id: dto.companyId } })
      : undefined;
    if (dto.companyId && !company) throw new BadRequestException('Company not found');

    const entity = this.warehouseRepository.create({ name: dto.name, ...(company !== undefined ? { company } : {}) });
    return this.warehouseRepository.save(entity);
  }

  async update(id: number, dto: UpdateWarehouseDto) {
    const entity = await this.warehouseRepository.findOne({ where: { id }, relations: ['company'] });
    if (!entity) throw new BadRequestException('Warehouse not found');

    if (dto.companyId !== undefined) {
      if (dto.companyId === null) {
        entity.company = null;
      } else {
        const company = await this.companyRepository.findOne({ where: { id: dto.companyId } });
        if (!company) throw new BadRequestException('Company not found');
        entity.company = company;
      }
    }

    entity.name = dto.name ?? entity.name;
    return this.warehouseRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.warehouseRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Warehouse not found');
    await this.warehouseRepository.remove(entity);
    return { message: `Warehouse ${id} deleted.` };
  }
}
