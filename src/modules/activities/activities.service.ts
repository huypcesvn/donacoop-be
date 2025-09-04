import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Truck } from '../trucks/truck.entity';
import { StoneType } from '../stone_types/stone-type.entity';
import { Machinery } from '../machineries/machinery.entity';
import { Company } from '../companies/company.entity';
import { Registration } from '../registrations/registration.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private activityRepository: Repository<Activity>,
    @InjectRepository(Truck) private truckRepository: Repository<Truck>,
    @InjectRepository(StoneType) private stoneTypeRepository: Repository<StoneType>,
    @InjectRepository(Machinery) private machineryRepository: Repository<Machinery>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(Registration) private registrationRepository: Repository<Registration>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string, truckId?: number) {
    const skip = (page - 1) * limit;
    const qb = this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.truck', 'truck')
      .leftJoinAndSelect('activity.stoneType', 'stoneType')
      .leftJoinAndSelect('activity.pickupPosition', 'pickupPosition')
      .leftJoinAndSelect('activity.buyerCompany', 'buyerCompany')
      .leftJoinAndSelect('activity.registration', 'registration')
      .orderBy('activity.id', 'ASC');

    if (keyword) qb.where('truck.licensePlate ILIKE :keyword OR activity.revenueType ILIKE :keyword', { keyword: `%${keyword}%` });
    if (truckId) qb.andWhere('truck.id = :truckId', { truckId });

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(dto: CreateActivityDto) {
    const truck = await this.truckRepository.findOne({ where: { id: dto.truckId } });
    if (!truck) throw new BadRequestException('Truck not found');
    const stoneType = dto.stoneTypeId ? await this.stoneTypeRepository.findOne({ where: { id: dto.stoneTypeId } }) : undefined;
    const pickupPosition = dto.pickupPositionId ? await this.machineryRepository.findOne({ where: { id: dto.pickupPositionId } }) : undefined;
    const buyerCompany = dto.buyerCompanyId ? await this.companyRepository.findOne({ where: { id: dto.buyerCompanyId } }) : undefined;
    const registration = dto.registrationId ? await this.registrationRepository.findOne({ where: { id: dto.registrationId } }) : undefined;

    const entity = this.activityRepository.create({
      ...(dto.gateInTime !== undefined ? { gateInTime: dto.gateInTime as any } : {}),
      ...(dto.weighTime1 !== undefined ? { weighTime1: dto.weighTime1 as any } : {}),
      ...(dto.weighPosition1 !== undefined ? { weighPosition1: dto.weighPosition1 } : {}),
      ...(dto.weight1 !== undefined ? { weight1: dto.weight1 } : {}),
      ...(dto.weighTime2 !== undefined ? { weighTime2: dto.weighTime2 as any } : {}),
      ...(dto.weighPosition2 !== undefined ? { weighPosition2: dto.weighPosition2 } : {}),
      ...(dto.weight2 !== undefined ? { weight2: dto.weight2 } : {}),
      ...(dto.gateOutTime !== undefined ? { gateOutTime: dto.gateOutTime as any } : {}),
      ...(dto.weighingPosition !== undefined ? { weighingPosition: dto.weighingPosition } : {}),
      ...(dto.revenueType !== undefined ? { revenueType: dto.revenueType } : {}),
      truck,
      ...(stoneType !== undefined ? { stoneType } : {}),
      ...(pickupPosition !== undefined ? { pickupPosition } : {}),
      ...(buyerCompany !== undefined ? { buyerCompany } : {}),
      ...(registration !== undefined ? { registration } : {}),
    } as any);
    return this.activityRepository.save(entity);
  }

  async update(id: number, dto: UpdateActivityDto) {
    const entity = await this.activityRepository.findOne({ where: { id }, relations: ['truck', 'stoneType', 'pickupPosition', 'buyerCompany', 'registration'] });
    if (!entity) throw new BadRequestException('Activity not found');

    if (dto.truckId) {
      const truck = await this.truckRepository.findOne({ where: { id: dto.truckId } });
      if (!truck) throw new BadRequestException('Truck not found');
      entity.truck = truck;
    }
    if (dto.stoneTypeId !== undefined) entity.stoneType = dto.stoneTypeId ? await this.stoneTypeRepository.findOne({ where: { id: dto.stoneTypeId } }) : null as any;
    if (dto.pickupPositionId !== undefined) entity.pickupPosition = dto.pickupPositionId ? await this.machineryRepository.findOne({ where: { id: dto.pickupPositionId } }) : null as any;
    if (dto.buyerCompanyId !== undefined) entity.buyerCompany = dto.buyerCompanyId ? await this.companyRepository.findOne({ where: { id: dto.buyerCompanyId } }) : null as any;
    if (dto.registrationId !== undefined) entity.registration = dto.registrationId ? await this.registrationRepository.findOne({ where: { id: dto.registrationId } }) : null as any;

    Object.assign(entity, {
      gateInTime: dto.gateInTime ?? entity.gateInTime,
      weighTime1: dto.weighTime1 ?? entity.weighTime1,
      weighPosition1: dto.weighPosition1 ?? entity.weighPosition1,
      weight1: dto.weight1 ?? entity.weight1,
      weighTime2: dto.weighTime2 ?? entity.weighTime2,
      weighPosition2: dto.weighPosition2 ?? entity.weighPosition2,
      weight2: dto.weight2 ?? entity.weight2,
      gateOutTime: dto.gateOutTime ?? entity.gateOutTime,
      weighingPosition: dto.weighingPosition ?? entity.weighingPosition,
      revenueType: dto.revenueType ?? entity.revenueType,
    });
    return this.activityRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.activityRepository.findOne({ where: { id } });
    if (!entity) throw new BadRequestException('Activity not found');
    await this.activityRepository.remove(entity);
    return { message: `Activity ${id} deleted.` };
  }
}
