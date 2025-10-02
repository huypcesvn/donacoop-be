import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { RegistrationsService } from './registrations.service';
import { Registration } from './registration.entity';
import { Truck } from '../trucks/truck.entity';
import { StoneType } from '../stone_types/stone-type.entity';
import { Machinery } from '../machineries/machinery.entity';
import { Company } from '../companies/company.entity';
import { DeliveryPoint } from '../delivery_points/delivery-points.entity';
import { Warehouse } from '../warehouses/warehouse.entity';

type MockRepository<T extends ObjectLiteral = any> = {
  [P in keyof Repository<T>]: jest.Mock;
};

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn(),
} as any);

describe('RegistrationsService', () => {
  let service: RegistrationsService;
  let registrationRepo: MockRepository<Registration>;
  let truckRepo: MockRepository<Truck>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationsService,
        { provide: getRepositoryToken(Registration), useValue: createMockRepository<Registration>() },
        { provide: getRepositoryToken(Truck), useValue: createMockRepository<Truck>() },
        { provide: getRepositoryToken(StoneType), useValue: createMockRepository<StoneType>() },
        { provide: getRepositoryToken(Machinery), useValue: createMockRepository<Machinery>() },
        { provide: getRepositoryToken(Company), useValue: createMockRepository<Company>() },
        { provide: getRepositoryToken(DeliveryPoint), useValue: createMockRepository<DeliveryPoint>() },
        { provide: getRepositoryToken(Warehouse), useValue: createMockRepository<Warehouse>() },
      ],
    }).compile();

    service = module.get<RegistrationsService>(RegistrationsService);
    registrationRepo = module.get(getRepositoryToken(Registration));
    truckRepo = module.get(getRepositoryToken(Truck));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if truck not found', async () => {
      (truckRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.create({ truckId: 1 } as any)).rejects.toThrow(BadRequestException);
    });

    it('should save a registration when truck exists', async () => {
      const mockTruck = { id: 1 } as Truck;
      (truckRepo.findOne as jest.Mock).mockResolvedValue(mockTruck);
      (registrationRepo.save as jest.Mock).mockResolvedValue({ id: 99 });

      const result = await service.create({ truckId: 1 } as any);

      expect(result).toEqual({ id: 99 });
      expect(registrationRepo.save).toHaveBeenCalled();
    });

    it('should throw if origin and destination warehouse are the same', async () => {
      await expect(
        service.create({ originWarehouseId: 1, destinationWarehouseId: 1 } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should throw if registration not found', async () => {
      (registrationRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
    });

    it('should update registration if exists', async () => {
      const existing = { id: 1 } as Registration;
      (registrationRepo.findOne as jest.Mock).mockResolvedValue(existing);
      (truckRepo.findOne as jest.Mock).mockResolvedValue({ id: 2 } as Truck);
      (registrationRepo.save as jest.Mock).mockResolvedValue({ id: 1, truck: { id: 2 } });

      const result = await service.update(1, { truckId: 2 } as any);

      expect(result.truck!.id).toBe(2);
      expect(registrationRepo.save).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should throw if registration not found', async () => {
      (registrationRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(BadRequestException);
    });

    it('should remove registration if exists', async () => {
      const existing = { id: 1 } as Registration;
      (registrationRepo.findOne as jest.Mock).mockResolvedValue(existing);
      (registrationRepo.remove as jest.Mock).mockResolvedValue(existing);

      const result = await service.delete(1);

      expect(result).toEqual({ message: `Registration 1 deleted.` });
      expect(registrationRepo.remove).toHaveBeenCalledWith(existing);
    });
  });
});
