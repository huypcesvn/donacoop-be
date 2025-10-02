import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { DeliveryPointsService } from './delivery-points.service';
import { DeliveryPoint } from './delivery-points.entity';
import { Company } from '../companies/company.entity';

type MockRepository<T extends object = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('DeliveryPointsService', () => {
  let service: DeliveryPointsService;
  let deliveryPointRepo: MockRepository<DeliveryPoint>;
  let companyRepo: MockRepository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryPointsService,
        {
          provide: getRepositoryToken(DeliveryPoint),
          useValue: {
            createQueryBuilder: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeliveryPointsService>(DeliveryPointsService);
    deliveryPointRepo = module.get(getRepositoryToken(DeliveryPoint));
    companyRepo = module.get(getRepositoryToken(Company));
  });

  describe('findAll', () => {
    it('should return paginated delivery points', async () => {
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
      (deliveryPointRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

      const result = await service.findAll(1, 10, 'test', 5);
      expect(result).toEqual({
        data: [{ id: 1 }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('create', () => {
    it('should create delivery point when company exists', async () => {
      const dto = { name: 'DP1', distance: 10, description: 'desc', companyId: 1 };
      (companyRepo.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      (deliveryPointRepo.create as jest.Mock).mockReturnValue(dto);
      (deliveryPointRepo.save as jest.Mock).mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto as any);
      expect(result).toEqual({ id: 1, ...dto });
      expect(companyRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw if company not found', async () => {
      (companyRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.create({ companyId: 1 } as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update delivery point when found', async () => {
      const dto = { name: 'Updated', distance: 20 };
      const entity = { id: 1, name: 'Old', distance: 5, company: { id: 1 } };
      (deliveryPointRepo.findOne as jest.Mock).mockResolvedValue(entity);
      (deliveryPointRepo.save as jest.Mock).mockImplementation((e) => Promise.resolve(e));

      const result = await service.update(1, dto as any);
      expect(result.name).toBe('Updated');
      expect(result.distance).toBe(20);
    });

    it('should throw if delivery point not found', async () => {
      (deliveryPointRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
    });

    it('should update company if companyId provided', async () => {
      const dto = { companyId: 2 };
      const entity = { id: 1, name: 'Old', distance: 5, company: { id: 1 } };
      (deliveryPointRepo.findOne as jest.Mock).mockResolvedValue(entity);
      (companyRepo.findOne as jest.Mock).mockResolvedValue({ id: 2 });
      (deliveryPointRepo.save as jest.Mock).mockImplementation((e) => Promise.resolve(e));

      const result = await service.update(1, dto as any);
      expect(result.company.id).toBe(2);
    });

    it('should throw if new company not found', async () => {
      const dto = { companyId: 99 };
      const entity = { id: 1, company: { id: 1 } };
      (deliveryPointRepo.findOne as jest.Mock).mockResolvedValue(entity);
      (companyRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(1, dto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should remove entity if found', async () => {
      const entity = { id: 1 };
      (deliveryPointRepo.findOne as jest.Mock).mockResolvedValue(entity);
      (deliveryPointRepo.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await service.delete(1);
      expect(result).toEqual({ message: 'Delivery point 1 deleted.' });
    });

    it('should throw if entity not found', async () => {
      (deliveryPointRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toThrow(BadRequestException);
    });
  });
});
