import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoneType } from './stone-type.entity';
import { CreateStoneTypeDto } from './dto/create-stone-type.dto';
import { UpdateStoneTypeDto } from './dto/update-stone-type.dto';

@Injectable()
export class StoneTypesService {
  constructor(@InjectRepository(StoneType) private stoneTypeRepository: Repository<StoneType>) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string) {
    const skip = (page - 1) * limit;
    const qb = this.stoneTypeRepository
      .createQueryBuilder('stoneType')
      .orderBy('stoneType.name', 'ASC');

    if (keyword) qb.where('stoneType.name ILIKE :keyword', { keyword: `%${keyword}%` });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateStoneTypeDto) {
    const existing = await this.stoneTypeRepository.findOne({ where: { name: dto.name } });
    if (existing) throw new BadRequestException('Stone type already exists.');
    const entity = this.stoneTypeRepository.create(dto);
    return this.stoneTypeRepository.save(entity);
  }

  async update(id: number, dto: UpdateStoneTypeDto) {
    const entity = await this.stoneTypeRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Stone type not found.');
    Object.assign(entity, dto);
    return this.stoneTypeRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.stoneTypeRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Stone type not found.');
    await this.stoneTypeRepository.remove(entity);
    return { message: `Stone type ${id} deleted.` };
  }
}
