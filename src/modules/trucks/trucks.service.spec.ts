import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrucksService } from './trucks.service';
import { Truck } from './truck.entity';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';

const createMockRepo = () => ({
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('TrucksService', () => {
  let service: TrucksService;
  let truckRepo: jest.Mocked<Repository<Truck>>;
  let companyRepo: jest.Mocked<Repository<Company>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrucksService,
        { provide: getRepositoryToken(Truck), useValue: createMockRepo() },
        { provide: getRepositoryToken(Company), useValue: createMockRepo() },
        { provide: getRepositoryToken(User), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get<TrucksService>(TrucksService);
    truckRepo = module.get(getRepositoryToken(Truck));
    companyRepo = module.get(getRepositoryToken(Company));
    userRepo = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should throw if company not found', async () => {
      companyRepo.findOne.mockResolvedValue(null as any);
      await expect(service.create({ licensePlate: '51A', companyId: 1 } as any)).rejects.toThrow('Company not found');
    });

    it('should throw if driver not found', async () => {
      companyRepo.findOne.mockResolvedValue({ id: 1 } as Company);
      userRepo.findOne.mockResolvedValue(null as any);
      await expect(
        service.create({ licensePlate: '51A', companyId: 1, driverId: 7 } as any),
      ).rejects.toThrow('Driver not found');
    });

    it('should create truck successfully', async () => {
      companyRepo.findOne.mockResolvedValue({ id: 1 } as Company);
      userRepo.findOne.mockResolvedValue({ id: 7 } as User);
      truckRepo.create.mockReturnValue({ licensePlate: '51A' } as Truck);
      truckRepo.save.mockResolvedValue({ id: 99, licensePlate: '51A' } as Truck);

      const result = await service.create({ licensePlate: '51A', companyId: 1, driverId: 7 } as any);
      expect(result).toEqual({ id: 99, licensePlate: '51A' });
    });
  });

  describe('findAll', () => {
    let qb: any;

    beforeEach(() => {
      qb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      };
      (truckRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);
    });

    it('should return trucks without filters', async () => {
      (qb.getManyAndCount as jest.Mock).mockResolvedValue([[{ id: 1 }], 1]);
      const result = await service.findAll(1, 10);
      expect(result.data[0].id).toBe(1);
      expect(result.total).toBe(1);
    });

    it('should apply keyword filter', async () => {
      (qb.getManyAndCount as jest.Mock).mockResolvedValue([[], 0]);
      await service.findAll(1, 10, '51A');
      expect(qb.where).toHaveBeenCalled();
    });

    it('should apply companyId filter', async () => {
      (qb.getManyAndCount as jest.Mock).mockResolvedValue([[], 0]);
      await service.findAll(1, 10, undefined, 2);
      expect(qb.andWhere).toHaveBeenCalledWith('company.id = :companyId', { companyId: 2 });
    });

    it('should apply driverId filter', async () => {
      (qb.getManyAndCount as jest.Mock).mockResolvedValue([[], 0]);
      await service.findAll(1, 10, undefined, undefined, 5);
      expect(qb.andWhere).toHaveBeenCalledWith('driver.id = :driverId', { driverId: 5 });
    });
  });

  describe('update', () => {
    it('should throw if truck not found', async () => {
      truckRepo.findOne.mockResolvedValue(null as any);
      await expect(service.update(1, { licensePlate: 'XX' })).rejects.toThrow('Truck not found');
    });

    it('should throw if company not found when updating company', async () => {
      truckRepo.findOne.mockResolvedValue({ id: 1 } as Truck);
      companyRepo.findOne.mockResolvedValue(null as any);
      await expect(service.update(1, { companyId: 2 })).rejects.toThrow('Company not found');
    });

    it('should throw if driver not found when updating driver', async () => {
      truckRepo.findOne.mockResolvedValue({ id: 1 } as Truck);
      userRepo.findOne.mockResolvedValue(null as any);
      await expect(service.update(1, { driverId: 5 })).rejects.toThrow('Driver not found');
    });

    it('should remove driver if driverId is null', async () => {
      const entity = { id: 1, driver: { id: 5 } } as any;
      truckRepo.findOne.mockResolvedValue(entity);
      truckRepo.save.mockResolvedValue({ ...entity, driver: null });
      const result = await service.update(1, { driverId: null });
      expect(result.driver).toBeNull();
    });

    it('should update truck successfully', async () => {
      const entity = { id: 1, licensePlate: 'AA', company: { id: 1 }, driver: null } as any;
      truckRepo.findOne.mockResolvedValue(entity);
      companyRepo.findOne.mockResolvedValue({ id: 2 } as Company);
      userRepo.findOne.mockResolvedValue({ id: 5 } as User);
      truckRepo.save.mockResolvedValue({ id: 1, licensePlate: 'BB' } as Truck);

      const result = await service.update(1, { licensePlate: 'BB', companyId: 2, driverId: 5 });
      expect(result).toEqual({ id: 1, licensePlate: 'BB' });
    });
  });

  describe('delete', () => {
    it('should throw if truck not found', async () => {
      truckRepo.findOne.mockResolvedValue(null as any);
      await expect(service.delete(1)).rejects.toThrow('Truck not found');
    });

    it('should delete successfully', async () => {
      truckRepo.findOne.mockResolvedValue({ id: 1 } as Truck);
      truckRepo.remove.mockResolvedValue({ id: 1 } as Truck);
      const result = await service.delete(1);
      expect(result).toEqual({ message: 'Truck 1 deleted.' });
    });
  });
});
