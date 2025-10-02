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
import { vnToUtc } from '../../common/utils/date-time.util';

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
      .orderBy('registration.id', 'DESC');

    if (keyword) qb.where('CAST(registration.tripNumber AS TEXT) ILIKE :keyword OR truck.licensePlate ILIKE :keyword', { keyword: `%${keyword}%` });
    if (truckId) qb.andWhere('truck.id = :truckId', { truckId });
    if (buyerCompanyId) qb.andWhere('buyerCompany.id = :buyerCompanyId', { buyerCompanyId });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateRegistrationDto) {
    const entity = await this.applyDtoToEntity(dto);
    return this.registrationRepository.save(entity);
  }

  async update(id: number, dto: UpdateRegistrationDto) {
    const entity = await this.registrationRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Registration not found');

    const updated = await this.applyDtoToEntity(dto, entity);
    return this.registrationRepository.save(updated);
  }

  async delete(id: number) {
    const entity = await this.registrationRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Registration not found');
    await this.registrationRepository.remove(entity);
    return { message: `Registration ${id} deleted.` };
  }

  private async applyDtoToEntity(dto: CreateRegistrationDto | UpdateRegistrationDto, entity?: Registration): Promise<Registration> {
    if (dto.originWarehouseId !== undefined && dto.destinationWarehouseId !== undefined && dto.originWarehouseId === dto.destinationWarehouseId) {
      throw new BadRequestException('Origin warehouse and destination warehouse cannot be the same');
    }

    const registration = entity ?? new Registration();

    if (dto.truckId) {
      const truck = await this.truckRepository.findOne({ where: { id: dto.truckId } });
      if (!truck) throw new BadRequestException('Truck not found');
      registration.truck = truck;
    }
    if (dto.stoneTypeId !== undefined) {
      registration.stoneType = dto.stoneTypeId ? await this.stoneTypeRepository.findOne({ where: { id: dto.stoneTypeId } }) : null!;
    }
    if (dto.pickupPositionId !== undefined) {
      registration.pickupPosition = dto.pickupPositionId ? await this.machineryRepository.findOne({ where: { id: dto.pickupPositionId } }) : null!;
    }
    if (dto.buyerCompanyId !== undefined) {
      registration.buyerCompany = dto.buyerCompanyId ? await this.companyRepository.findOne({ where: { id: dto.buyerCompanyId } }) : null!;
    }
    if (dto.destinationId !== undefined) {
      registration.destination = dto.destinationId ? await this.deliveryPointRepository.findOne({ where: { id: dto.destinationId } }) : null!;
    }
    if (dto.originWarehouseId !== undefined) {
      registration.originWarehouse = dto.originWarehouseId ? await this.warehouseRepository.findOne({ where: { id: dto.originWarehouseId } }) : null!;
    }
    if (dto.destinationWarehouseId !== undefined) {
      registration.destinationWarehouse = dto.destinationWarehouseId ? await this.warehouseRepository.findOne({ where: { id: dto.destinationWarehouseId } }) : null!;
    }

    Object.assign(registration, {
      tripNumber: dto.tripNumber ?? registration.tripNumber,
      arrivalDate: dto.arrivalDate !== undefined ? vnToUtc(dto.arrivalDate) : registration.arrivalDate,
      arrivalTime: dto.arrivalTime ?? registration.arrivalTime,
      distance: dto.distance ?? registration.distance,
      description: dto.description ?? registration.description,
      revenueType: dto.revenueType ?? registration.revenueType,
      registrationStatus: dto.registrationStatus ?? registration.registrationStatus,
    });

    return registration;
  }
}
