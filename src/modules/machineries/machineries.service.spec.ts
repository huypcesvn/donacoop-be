import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MachineriesService } from './machineries.service';
import { Machinery } from './machinery.entity';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';

describe('MachineriesService', () => {
  let service: MachineriesService;
  let machineryRepo: jest.Mocked<Repository<Machinery>>;
  let companyRepo: jest.Mocked<Repository<Company>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachineriesService,
        {
          provide: getRepositoryToken(Machinery),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MachineriesService>(MachineriesService);
    machineryRepo = module.get(getRepositoryToken(Machinery));
    companyRepo = module.get(getRepositoryToken(Company));
    userRepo = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create machinery successfully', async () => {
      const dto = { name: 'M1', companyId: 1, driverId: 2 };
      const company = { id: 1 } as Company;
      const driver = { id: 2 } as User;
      const machinery = { id: 1, name: 'M1' } as Machinery;

      companyRepo.findOne.mockResolvedValue(company);
      userRepo.findOne.mockResolvedValue(driver);
      machineryRepo.create.mockReturnValue(machinery);
      machineryRepo.save.mockResolvedValue(machinery);

      const result = await service.create(dto);

      expect(result).toEqual(machinery);
      expect(machineryRepo.create).toHaveBeenCalledWith({
        name: 'M1',
        account: undefined,
        password: undefined,
        description: undefined,
        company,
        driver,
      });
    });

    it('should throw error if company not found', async () => {
      companyRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ name: 'M1', companyId: 1 })).rejects.toThrow('Company not found');
    });

    it('should throw error if driver not found', async () => {
      companyRepo.findOne.mockResolvedValue({ id: 1 } as Company);
      userRepo.findOne.mockResolvedValue(null); // driver not found
      await expect(service.create({ name: 'M1', companyId: 1, driverId: 2 })).rejects.toThrow('Driver not found');
    });
  });

  describe('findAll', () => {
    it('should return list of machineries with filters', async () => {
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]),
      };
      machineryRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll(1, 10, 'abc', 1, 2);

      expect(qb.where).toHaveBeenCalled();
      expect(qb.andWhere).toHaveBeenCalledTimes(2);
      expect(result.total).toBe(1);
      expect(result.data[0].id).toBe(1); // sửa từ items -> data
    });
  });

  describe('update', () => {
    it('should update machinery successfully', async () => {
      const machinery = { id: 1, name: 'Old' } as Machinery;
      machineryRepo.findOne.mockResolvedValue(machinery);
      companyRepo.findOne.mockResolvedValue({ id: 2 } as Company);
      userRepo.findOne.mockResolvedValue({ id: 3 } as User);
      machineryRepo.save.mockResolvedValue({ ...machinery, name: 'New' });

      const result = await service.update(1, { name: 'New', companyId: 2, driverId: 3 });

      expect(result.name).toBe('New');
      expect(machinery.company.id).toBe(2);
      expect(machinery.driver.id).toBe(3);
    });

    it('should throw error if machinery not found', async () => {
      machineryRepo.findOne.mockResolvedValue(null);
      await expect(service.update(1, { name: 'X' })).rejects.toThrow('Machinery not found');
    });

    it('should throw error if new company not found', async () => {
      const machinery = { id: 1 } as Machinery;
      machineryRepo.findOne.mockResolvedValue(machinery);
      companyRepo.findOne.mockResolvedValue(null);

      await expect(service.update(1, { companyId: 99 })).rejects.toThrow('Company not found');
    });

    it('should allow setting driver = null', async () => {
      const machinery = { id: 1, driver: { id: 2 } as User } as Machinery;
      machineryRepo.findOne.mockResolvedValue(machinery);
      machineryRepo.save.mockResolvedValue({ ...(machinery as any), driver: null } as any);

      const result = await service.update(1, { driverId: null });
      expect(result.driver).toBeNull();
    });

    it('should throw error if new driver not found', async () => {
      const machinery = { id: 1 } as Machinery;
      machineryRepo.findOne.mockResolvedValue(machinery);
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.update(1, { driverId: 99 })).rejects.toThrow('Driver not found');
    });
  });

  describe('delete', () => {
    it('should delete machinery successfully', async () => {
      const machinery = { id: 1 } as Machinery;
      machineryRepo.findOne.mockResolvedValue(machinery);
      machineryRepo.remove.mockResolvedValue(machinery);

      const result = await service.delete(1);
      expect(result.message).toBe('Machinery 1 deleted.');
    });

    it('should throw error if machinery not found', async () => {
      machineryRepo.findOne.mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toThrow('Machinery not found');
    });
  });
});
