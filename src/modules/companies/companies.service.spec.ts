import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CompaniesService } from './companies.service';
import { Company } from './company.entity';
import { BadRequestException } from '@nestjs/common';

// Mock EntityManager
const mockEntityManager = {
  create: jest.fn(),
  remove: jest.fn(),
};

// Mock Repository
const mockCompanyRepository = {
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  manager: mockEntityManager,
};

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repository: jest.Mocked<Repository<Company>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    repository = module.get(getRepositoryToken(Company));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated companies without keyword', async () => {
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]),
      };
      (repository.createQueryBuilder as jest.Mock).mockReturnValue(qb);

      const result = await service.findAll(1, 10);
      expect(result.data).toEqual([{ id: 1 }]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should apply keyword filter if provided', async () => {
      const qb: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 2 }], 1]),
      };
      (repository.createQueryBuilder as jest.Mock).mockReturnValue(qb);

      const result = await service.findAll(1, 5, 'keyword');
      expect(qb.where).toHaveBeenCalled();
      expect(result.data).toEqual([{ id: 2 }]);
    });
  });

  describe('create', () => {
    it('should throw if company already exists', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(
        service.create({ name: 'Existing', deliveryPoints: [] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create company with deliveryPoints', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);
      (repository.create as jest.Mock).mockImplementation((dto) => dto);
      (repository.save as jest.Mock).mockImplementation((dto) =>
        Promise.resolve({ id: 1, ...dto }),
      );
      (repository.manager.create as jest.Mock).mockImplementation((_, dto) => dto);

      const dto = {
        name: 'New Company',
        deliveryPoints: [{ id: 1, name: 'DP1' }],
      };
      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('New Company');
    });
  });

  describe('update', () => {
    it('should throw if company not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        service.update(1, { name: 'Updated' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update company data and deliveryPoints', async () => {
      const existing = {
        id: 1,
        name: 'Old',
        deliveryPoints: [{ id: 1, name: 'DP1' }],
      };
      (repository.findOne as jest.Mock).mockResolvedValue(existing);
      (repository.manager.remove as jest.Mock).mockResolvedValue(undefined);
      (repository.manager.create as jest.Mock).mockImplementation((_, dto) => dto);
      (repository.save as jest.Mock).mockImplementation((dto) => dto);

      const dto = {
        name: 'Updated',
        deliveryPoints: [{ id: 2, name: 'DP2' }],
      };
      const result = await service.update(1, dto);

      expect(repository.manager.remove).toHaveBeenCalled();
      expect(result.name).toBe('Updated');
      expect(result.deliveryPoints[0].id).toBe(2);
    });
  });

  describe('delete', () => {
    it('should throw if company not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toThrow(BadRequestException);
    });

    it('should delete company successfully', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      (repository.delete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result.message).toBe('Company with id 1 has been deleted.');
    });
  });
});
