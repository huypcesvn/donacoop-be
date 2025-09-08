import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from './registration.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { Truck } from '../trucks/truck.entity';
import { StoneType } from '../stone_types/stone-type.entity';
import { Machinery } from '../machineries/machinery.entity';
import { Company } from '../companies/company.entity';
import { DeliveryPoint } from '../delivery_points/delivery-points.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration) private registrationRepository: Repository<Registration>,
    @InjectRepository(Truck) private truckRepository: Repository<Truck>,
    @InjectRepository(StoneType) private stoneTypeRepository: Repository<StoneType>,
    @InjectRepository(Machinery) private machineryRepository: Repository<Machinery>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(DeliveryPoint) private deliveryPointRepository: Repository<DeliveryPoint>,
    @InjectRepository(Warehouse) private warehouseRepository: Repository<Warehouse>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string, truckId?: number, buyerCompanyId?: number) {
    const skip = (page - 1) * limit;
    const qb = this.registrationRepository
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.truck', 'truck')
      .leftJoinAndSelect('registration.stoneType', 'stoneType')
      .leftJoinAndSelect('registration.pickupPosition', 'pickupPosition')
      .leftJoinAndSelect('registration.buyerCompany', 'buyerCompany')
      .leftJoinAndSelect('registration.destination', 'destination')
      .leftJoinAndSelect('registration.originWarehouse', 'originWarehouse')
      .leftJoinAndSelect('registration.destinationWarehouse', 'destinationWarehouse')
      .orderBy('registration.id', 'ASC');

    if (keyword) qb.where('CAST(registration.tripNumber AS TEXT) ILIKE :keyword OR truck.licensePlate ILIKE :keyword', { keyword: `%${keyword}%` });
    if (truckId) qb.andWhere('truck.id = :truckId', { truckId });
    if (buyerCompanyId) qb.andWhere('buyerCompany.id = :buyerCompanyId', { buyerCompanyId });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateRegistrationDto) {
    const truck = await this.truckRepository.findOne({ where: { id: dto.truckId } });
    if (!truck) throw new BadRequestException('Truck not found');

    if (dto.originWarehouseId && dto.destinationWarehouseId && dto.originWarehouseId === dto.destinationWarehouseId) {
      throw new BadRequestException('Origin warehouse and destination warehouse cannot be the same');
    }

    const stoneType = dto.stoneTypeId ? await this.stoneTypeRepository.findOne({ where: { id: dto.stoneTypeId } }) : undefined;
    const pickupPosition = dto.pickupPositionId ? await this.machineryRepository.findOne({ where: { id: dto.pickupPositionId } }) : undefined;
    const buyerCompany = dto.buyerCompanyId ? await this.companyRepository.findOne({ where: { id: dto.buyerCompanyId } }) : undefined;
    const destination = dto.destinationId ? await this.deliveryPointRepository.findOne({ where: { id: dto.destinationId } }) : undefined;
    const originWarehouse = dto.originWarehouseId ? await this.warehouseRepository.findOne({ where: { id: dto.originWarehouseId } }) : undefined;
    const destinationWarehouse = dto.destinationWarehouseId ? await this.warehouseRepository.findOne({ where: { id: dto.destinationWarehouseId } }) : undefined;

    const entity = this.registrationRepository.create({
      ...(dto.tripNumber !== undefined ? { tripNumber: dto.tripNumber } : {}),
      ...(dto.arrivalDate !== undefined ? { arrivalDate: dto.arrivalDate as any } : {}),
      ...(dto.arrivalTime !== undefined ? { arrivalTime: dto.arrivalTime } : {}),
      ...(dto.distance !== undefined ? { distance: dto.distance } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.revenueType !== undefined ? { revenueType: dto.revenueType } : {}),
      truck,
      ...(stoneType !== undefined ? { stoneType } : {}),
      ...(pickupPosition !== undefined ? { pickupPosition } : {}),
      ...(buyerCompany !== undefined ? { buyerCompany } : {}),
      ...(destination !== undefined ? { destination } : {}),
      ...(originWarehouse !== undefined ? { originWarehouse } : {}),
      ...(destinationWarehouse !== undefined ? { destinationWarehouse } : {}),
    } as any);
    return this.registrationRepository.save(entity);
  }

  async update(id: number, dto: UpdateRegistrationDto) {
    const entity = await this.registrationRepository.findOne({
      where: { id },
      relations: [
        'truck',
        'stoneType',
        'pickupPosition',
        'buyerCompany',
        'destination',
        'originWarehouse',
        'destinationWarehouse',
      ],
    });
    if (!entity) throw new BadRequestException('Registration not found');

    if (dto.originWarehouseId !== undefined && dto.destinationWarehouseId !== undefined && dto.originWarehouseId === dto.destinationWarehouseId) {
      throw new BadRequestException('Origin warehouse and destination warehouse cannot be the same');
    }

    if (dto.truckId) {
      const truck = await this.truckRepository.findOne({ where: { id: dto.truckId } });
      if (!truck) throw new BadRequestException('Truck not found');
      entity.truck = truck;
    }
    if (dto.stoneTypeId !== undefined) {
      entity.stoneType = dto.stoneTypeId ? await this.stoneTypeRepository.findOne({ where: { id: dto.stoneTypeId } }) : null as any;
    }
    if (dto.pickupPositionId !== undefined) {
      entity.pickupPosition = dto.pickupPositionId ? await this.machineryRepository.findOne({ where: { id: dto.pickupPositionId } }) : null as any;
    }
    if (dto.buyerCompanyId !== undefined) {
      entity.buyerCompany = dto.buyerCompanyId ? await this.companyRepository.findOne({ where: { id: dto.buyerCompanyId } }) : null as any;
    }
    if (dto.destinationId !== undefined) {
      entity.destination = dto.destinationId ? await this.deliveryPointRepository.findOne({ where: { id: dto.destinationId } }) : null as any;
    }
    if (dto.originWarehouseId !== undefined) {
      entity.originWarehouse = dto.originWarehouseId ? await this.warehouseRepository.findOne({ where: { id: dto.originWarehouseId } }) : null as any;
    }
    if (dto.destinationWarehouseId !== undefined) {
      entity.destinationWarehouse = dto.destinationWarehouseId ? await this.warehouseRepository.findOne({ where: { id: dto.destinationWarehouseId } }) : null as any;
    }

    Object.assign(entity, {
      tripNumber: dto.tripNumber ?? entity.tripNumber,
      arrivalDate: dto.arrivalDate ?? entity.arrivalDate,
      arrivalTime: dto.arrivalTime ?? entity.arrivalTime,
      distance: dto.distance ?? entity.distance,
      description: dto.description ?? entity.description,
      revenueType: dto.revenueType ?? entity.revenueType,
    });
    return this.registrationRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.registrationRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Registration not found');
    await this.registrationRepository.remove(entity);
    return { message: `Registration ${id} deleted.` };
  }
}
