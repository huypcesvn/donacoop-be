import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryPoint } from './delivery-points.entity';
import { CreateDeliveryPointDto } from './dto/create-delivery-point.dto';
import { UpdateDeliveryPointDto } from './dto/update-delivery-point.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class DeliveryPointsService {
  constructor(
    @InjectRepository(DeliveryPoint) private deliveryPointRepository: Repository<DeliveryPoint>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string, companyId?: number) {
    const skip = (page - 1) * limit;
    const qb = this.deliveryPointRepository
      .createQueryBuilder('deliveryPoint')
      .leftJoinAndSelect('deliveryPoint.company', 'company')
      .orderBy('deliveryPoint.id', 'ASC')
      .addOrderBy('deliveryPoint.name', 'ASC');

    if (keyword) qb.where('deliveryPoint.name ILIKE :keyword', { keyword: `%${keyword}%` });
    if (companyId) qb.andWhere('company.id = :companyId', { companyId });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateDeliveryPointDto) {
    const company = await this.companyRepository.findOne({ where: { id: dto.companyId } });
    if (!company) throw new BadRequestException('Company not found');
    const entity = this.deliveryPointRepository.create({ name: dto.name, distance: dto.distance, description: dto.description, company });
    return this.deliveryPointRepository.save(entity);
  }

  async update(id: number, dto: UpdateDeliveryPointDto) {
    const entity = await this.deliveryPointRepository.findOne({ where: { id }, relations: ['company'] });
    if (!entity) throw new BadRequestException('Delivery point not found');
    if (dto.companyId) {
      const company = await this.companyRepository.findOne({ where: { id: dto.companyId } });
      if (!company) throw new BadRequestException('Company not found');
      entity.company = company;
    }
    entity.name = dto.name ?? entity.name;
    entity.distance = dto.distance ?? entity.distance;
    entity.description = dto.description ?? entity.description;
    return this.deliveryPointRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.deliveryPointRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Delivery point not found');
    await this.deliveryPointRepository.remove(entity);
    return { message: `Delivery point ${id} deleted.` };
  }
}
