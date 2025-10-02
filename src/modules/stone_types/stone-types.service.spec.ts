import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { StoneTypesService } from './stone-types.service';
import { StoneType } from './stone-type.entity';

const createMockRepo = () => ({
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('StoneTypesService', () => {
  let service: StoneTypesService;
  let repo: jest.Mocked<Repository<StoneType>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoneTypesService,
        {
          provide: getRepositoryToken(StoneType),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get<StoneTypesService>(StoneTypesService);
    repo = module.get(getRepositoryToken(StoneType));
  });

  describe('findAll', () => {
    it('should return paginated result', async () => {
      const qb: any = {
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[{ id: 1, name: 'Granite' }], 1]),
      };
      (repo.createQueryBuilder as any).mockReturnValue(qb);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data: [{ id: 1, name: 'Granite' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by keyword', async () => {
      const qb: any = {
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      (repo.createQueryBuilder as any).mockReturnValue(qb);

      await service.findAll(1, 10, 'Granite');
      expect(qb.where).toHaveBeenCalledWith('stoneType.name ILIKE :keyword', { keyword: '%Granite%' });
    });
  });

  describe('create', () => {
    it('should create a new stone type', async () => {
      (repo.findOne as any).mockResolvedValue(undefined);
      (repo.create as any).mockReturnValue({ name: 'Marble' });
      (repo.save as any).mockResolvedValue({ id: 1, name: 'Marble' });

      const result = await service.create({ name: 'Marble' });
      expect(result).toEqual({ id: 1, name: 'Marble' });
    });

    it('should throw if stone type already exists', async () => {
      (repo.findOne as any).mockResolvedValue({ id: 1, name: 'Marble' });

      await expect(service.create({ name: 'Marble' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an existing stone type', async () => {
      const entity = { id: 1, name: 'Old' };
      (repo.findOne as any).mockResolvedValue(entity);
      (repo.save as any).mockResolvedValue({ id: 1, name: 'New' });

      const result = await service.update(1, { name: 'New' });
      expect(result).toEqual({ id: 1, name: 'New' });
    });

    it('should throw if stone type not found', async () => {
      (repo.findOne as any).mockResolvedValue(undefined);
      await expect(service.update(1, { name: 'New' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a stone type', async () => {
      const entity = { id: 1, name: 'Granite' };
      (repo.findOne as any).mockResolvedValue(entity);
      (repo.remove as any).mockResolvedValue(entity);

      const result = await service.delete(1);
      expect(result).toEqual({ message: 'Stone type 1 deleted.' });
    });

    it('should throw if stone type not found', async () => {
      (repo.findOne as any).mockResolvedValue(undefined);
      await expect(service.delete(1)).rejects.toThrow(BadRequestException);
    });
  });
});
