import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { StoneType } from '../stone_types/stone-type.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock) private stockRepository: Repository<Stock>,
    @InjectRepository(Warehouse) private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(StoneType) private stoneTypeRepository: Repository<StoneType>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string, warehouseId?: number, stoneTypeId?: number) {
    const skip = (page - 1) * limit;
    const qb = this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.warehouse', 'warehouse')
      .leftJoinAndSelect('stock.stoneType', 'stoneType')
      .orderBy('warehouse.name', 'ASC')
      .addOrderBy('stoneType.name', 'ASC');

    if (keyword) qb.where('warehouse.name ILIKE :keyword OR stoneType.name ILIKE :keyword', { keyword: `%${keyword}%` });
    if (warehouseId) qb.andWhere('warehouse.id = :warehouseId', { warehouseId });
    if (stoneTypeId) qb.andWhere('stoneType.id = :stoneTypeId', { stoneTypeId });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateStockDto) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id: dto.warehouseId } });
    if (!warehouse) throw new BadRequestException('Warehouse not found');
    const stoneType = await this.stoneTypeRepository.findOne({ where: { id: dto.stoneTypeId } });
    if (!stoneType) throw new BadRequestException('Stone type not found');

    const entity = this.stockRepository.create({ quantity: dto.quantity, warehouse, stoneType });
    return this.stockRepository.save(entity);
  }

  async update(id: number, dto: UpdateStockDto) {
    const entity = await this.stockRepository.findOne({ where: { id }, relations: ['warehouse', 'stoneType'] });
    if (!entity) throw new BadRequestException('Stock not found');

    if (dto.warehouseId) {
      const warehouse = await this.warehouseRepository.findOne({ where: { id: dto.warehouseId } });
      if (!warehouse) throw new BadRequestException('Warehouse not found');
      entity.warehouse = warehouse;
    }
    if (dto.stoneTypeId) {
      const stoneType = await this.stoneTypeRepository.findOne({ where: { id: dto.stoneTypeId } });
      if (!stoneType) throw new BadRequestException('Stone type not found');
      entity.stoneType = stoneType;
    }
    if (dto.quantity !== undefined) entity.quantity = dto.quantity;
    return this.stockRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.stockRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Stock not found');
    await this.stockRepository.remove(entity);
    return { message: `Stock ${id} deleted.` };
  }
}
