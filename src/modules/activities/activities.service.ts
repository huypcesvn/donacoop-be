import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Truck } from '../trucks/truck.entity';
import { StoneType } from '../stone_types/stone-type.entity';
import { Machinery } from '../machineries/machinery.entity';
import { Company } from '../companies/company.entity';
import { Registration, RegistrationStatus } from '../registrations/registration.entity';
import { EnterGateActivityDto } from './dto/enter-gate-activity.dto';
import { WeighStationDto } from './dto/weigh-station.dto';

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
      // .leftJoinAndSelect('activity.buyerCompany', 'buyerCompany')
      .leftJoinAndSelect('activity.registration', 'registration')
      .leftJoinAndSelect('registration.destination', 'destination')
      .leftJoinAndSelect('registration.originWarehouse', 'originWarehouse')
      .leftJoinAndSelect( 'registration.destinationWarehouse', 'destinationWarehouse')
      .leftJoinAndSelect('registration.buyerCompany', 'buyerCompany')
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
    const entity = await this.activityRepository.findOne({
      where: { id },
      relations: [
        'truck',
        'stoneType',
        'pickupPosition',
        'buyerCompany',
        'registration',
      ],
    });
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

  async enterGate(dto: EnterGateActivityDto) {
    const truck = await this.truckRepository.findOne({
      where: { licensePlate: dto.licensePlate },
      relations: ['registrations'],
    });
    if (!truck) throw new BadRequestException('Truck not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const registrations = await this.registrationRepository.find({
      where: {
        truck: { id: truck.id },
        arrivalDate: today,
        registrationStatus: RegistrationStatus.PENDING,
      },
      relations: [
        'buyerCompany',
        'pickupPosition',
        'destination',
        'destinationWarehouse',
        'stoneType',
      ],
      order: { tripNumber: 'ASC' },
    });
    if (!registrations.length) return {
      message: 'No pending registration found for this truck today',
      licensePlate: dto.licensePlate,
    }

    const now = new Date();
    const [hours, minutes] = registrations[0].arrivalTime.split('-')[0].split(':').map(Number);
    const arrivalTime = new Date(today);
    arrivalTime.setHours(hours, minutes, 0, 0);
    const arrivalTimeEnd = new Date(arrivalTime);
    arrivalTimeEnd.setHours(arrivalTimeEnd.getHours() + 1);

    let selectedRegistration = registrations[0];
    if (now < arrivalTime || now > arrivalTimeEnd) {
      selectedRegistration = registrations.find(reg => {
        const [startHours, startMinutes] = reg.arrivalTime.split('-')[0].split(':').map(Number);
        const regArrivalTime = new Date(today);
        regArrivalTime.setHours(startHours, startMinutes, 0, 0);
        const regArrivalTimeEnd = new Date(regArrivalTime);
        regArrivalTimeEnd.setHours(regArrivalTimeEnd.getHours() + 1);
        return now < regArrivalTime || now > regArrivalTimeEnd;
      }) || registrations[0];
    }

    const activity = this.activityRepository.create({
      truck,
      gateInTime: now,
      registration: selectedRegistration,
      stoneType: selectedRegistration.stoneType,
      buyerCompany: selectedRegistration.buyerCompany,
      pickupPosition: selectedRegistration.pickupPosition,
    });
    await this.activityRepository.save(activity);

    selectedRegistration.registrationStatus = RegistrationStatus.ENTERED;
    await this.registrationRepository.save(selectedRegistration);

    let command = '';
    const weighingMethod = truck.weighingMethod;
    const hasWeighedToday = await this.activityRepository.findOne({
      where: {
        truck: { id: truck.id },
        weighTime1: Not(IsNull()),
        createdAt: MoreThanOrEqual(today),
      },
    });

    if (weighingMethod.toLowerCase() === 'cân mỗi chuyến' || (weighingMethod.toLowerCase() === 'cân 1 lần' && !hasWeighedToday) || (weighingMethod.toLowerCase() === 'cân mỗi đầu ngày' && !hasWeighedToday)) {
      command = truck.weighingPosition || 'Weigh station';
      await this.activityRepository.update(activity.id, {
        weighTime1: now,
        weighPosition1: truck.weighingPosition,
        weight1: 0, // Placeholder, update actual weight later
      });
    } else {
      command = selectedRegistration.pickupPosition?.name || 'Pickup position';
    }

    return {
      message: `Proceed to ${command}`,
      licensePlate: dto.licensePlate,
      gateInTime: now,
    };
  }

  async exitGate(dto: EnterGateActivityDto) {
    const truck = await this.truckRepository.findOne({
      where: { licensePlate: dto.licensePlate },
      relations: ['registrations'],
    });
    if (!truck) throw new BadRequestException('Truck not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const registration = await this.registrationRepository.findOne({
      where: {
        truck: { id: truck.id },
        arrivalDate: today,
        registrationStatus: RegistrationStatus.ENTERED,
      },
      order: { tripNumber: 'ASC' },
    });
    if (!registration) throw new BadRequestException('Truck has not entered gate');

    const activity = await this.activityRepository.findOne({
      where: {
        truck: { id: truck.id },
        registration: { id: registration.id },
        gateInTime: Not(IsNull()),
      },
    });
    if (!activity) throw new BadRequestException('No activity found for this truck');

    // Check if weigh station steps are completed
    if (!activity.weighTime1) {
      throw new BadRequestException('Truck has not completed first weighing');
    }
    if (activity.pickupPosition && !activity.weighTime2) {
      throw new BadRequestException('Truck has not completed second weighing after picking up stone');
    }

    activity.gateOutTime = new Date();
    await this.activityRepository.save(activity);

    registration.registrationStatus = RegistrationStatus.EXITED;
    await this.registrationRepository.save(registration);

    return {
      message: 'Proceed to exit gate',
      licensePlate: dto.licensePlate,
      gateOutTime: activity.gateOutTime,
    };
  }

  async weighStation(dto: WeighStationDto) {
    const { licensePlate, weight, stoneTypeId, weighStation } = dto;

    // Step 1: Check if truck exists
    const truck = await this.truckRepository.findOne({
      where: { licensePlate },
      relations: ['registrations'],
    });
    if (!truck) throw new BadRequestException('Truck not found');

    // Step 2: Check if truck has entered gate
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const registration = await this.registrationRepository.findOne({
      where: {
        truck: { id: truck.id },
        arrivalDate: today,
        registrationStatus: RegistrationStatus.ENTERED,
      },
      order: { tripNumber: 'ASC' },
      relations: ['stoneType', 'pickupPosition'],
    });
    if (!registration) throw new BadRequestException('Truck has not entered gate');

    // Step 3: Check weighing position
    const activity = await this.activityRepository.findOne({
      where: {
        truck: { id: truck.id },
        registration: { id: registration.id },
        gateInTime: Not(IsNull()),
      },
      relations: ['pickupPosition'],
    });
    if (!activity) throw new BadRequestException('No activity found for this truck');

    const expectedWeighPosition = truck.weighingPosition || 'Weigh station';
    if (weighStation !== expectedWeighPosition) {
      return {
        message: `Proceed to ${expectedWeighPosition}`,
        licensePlate,
      };
    }

    // Step 4: Handle cases based on whether stone has been picked up
    const now = new Date();
    if (!activity.pickupPosition) {
      // Case 1: Has not picked up stone
      if (!activity.weighTime1) {
        // Update weighTime1, weighPosition1, weight1
        await this.activityRepository.update(activity.id, {
          weighTime1: now,
          weighPosition1: weighStation,
          weight1: weight,
        });
        return {
          message: `Proceed to ${registration.pickupPosition?.name || 'Pickup position'}`,
          licensePlate,
          weighTime1: now,
        };
      } else {
        return {
          message: `Proceed to ${registration.pickupPosition?.name || 'Pickup position'}`,
          licensePlate,
        };
      }
    } else {
      // Case 2: Has picked up stone
      const stoneType = await this.stoneTypeRepository.findOne({ where: { id: stoneTypeId } });
      if (!stoneType || (registration.stoneType && registration.stoneType.id !== stoneTypeId)) {
        return {
          message: 'Incorrect stone type',
          licensePlate,
        }
      }

      // Use existing weight1 if already weighed, calculate cargo weight
      const cargoWeight = weight - (activity.weight1 || 0);
      if (cargoWeight > (truck.allowedLoad || Infinity)) {
        throw new BadRequestException('Overload detected');
      }

      if (activity.weighTime1) {
        // Only update weighTime2, weighPosition2, weight2 if first weighing is done
        await this.activityRepository.update(activity.id, {
          weighTime2: now,
          weighPosition2: weighStation,
          weight2: weight,
        });
      } else {
        throw new BadRequestException('Truck must complete first weighing before second weighing');
      }

      return {
        message: 'Proceed to exit gate',
        licensePlate,
        weighTime2: now,
        cargoWeight,
      };
    }
  }
}
