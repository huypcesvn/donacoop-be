import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesService } from './warehouses.service';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Company } from '../companies/company.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

describe('WarehousesService', () => {
  let service: WarehousesService;
  let warehouseRepo: Repository<Warehouse>;
  let companyRepo: Repository<Company>;

  const companyMock: Company = {
    id: 1,
    name: 'Company 1',
    address: '',
    phone: '',
    city: '',
    email: '',
    postalCode: '',
    type: '',
    deliveryPoints: [],
    users: [],
    trucks: [],
    machineries: [],
    warehouses: [],
    registrationsAsBuyer: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const warehouseMock: Warehouse = {
    id: 1,
    name: 'Warehouse 1',
    company: companyMock,
    stocks: [],
    registrationsAsOrigin: [],
    registrationsAsDestination: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const qbMock: any = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[warehouseMock], 1]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        {
          provide: getRepositoryToken(Warehouse),
          useValue: {
            create: jest.fn().mockImplementation(dto => ({ id: 1, ...dto })),
            save: jest.fn().mockImplementation(dto => ({ id: 1, ...dto })),
            findOne: jest.fn().mockResolvedValue(warehouseMock),
            remove: jest.fn().mockResolvedValue(undefined),
            createQueryBuilder: jest.fn().mockReturnValue(qbMock),
          },
        },
        {
          provide: getRepositoryToken(Company),
          useValue: {
            findOne: jest.fn().mockResolvedValue(companyMock),
          },
        },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    warehouseRepo = module.get<Repository<Warehouse>>(getRepositoryToken(Warehouse));
    companyRepo = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated warehouses', async () => {
      const result = await service.findAll(1, 10);
      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should apply keyword filter', async () => {
      await service.findAll(1, 10, 'Warehouse');
      expect(qbMock.where).toHaveBeenCalledWith('warehouse.name ILIKE :keyword', { keyword: '%Warehouse%' });
    });

    it('should apply companyId filter', async () => {
      await service.findAll(1, 10, undefined, 1);
      expect(qbMock.andWhere).toHaveBeenCalledWith('company.id = :companyId', { companyId: 1 });
    });
  });

  describe('create', () => {
    it('should create a warehouse with company', async () => {
      const dto: CreateWarehouseDto = { name: 'New Warehouse', companyId: 1 };
      const result = await service.create(dto);
      expect(result.name).toBe(dto.name);
      expect(result.company?.id).toBe(1);
    });

    it('should throw if company not found', async () => {
      jest.spyOn(companyRepo, 'findOne').mockResolvedValueOnce(null);
      const dto: CreateWarehouseDto = { name: 'New Warehouse', companyId: 999 };
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update warehouse name', async () => {
      const dto: UpdateWarehouseDto = { name: 'Updated Warehouse' };
      const result = await service.update(1, dto);
      expect(result.name).toBe(dto.name);
    });

    it('should update company', async () => {
      const dto: UpdateWarehouseDto = { companyId: 1 };
      const result = await service.update(1, dto);
      expect(result.company?.id).toBe(1);
    });

    it('should remove company if companyId is null', async () => {
      const dto: UpdateWarehouseDto = { companyId: null };
      const result = await service.update(1, dto);
      expect(result.company).toBeNull();
    });

    it('should throw if warehouse not found', async () => {
      jest.spyOn(warehouseRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(BadRequestException);
    });

    it('should throw if company not found', async () => {
      jest.spyOn(companyRepo, 'findOne').mockResolvedValueOnce(null);
      const dto: UpdateWarehouseDto = { companyId: 999 };
      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete warehouse', async () => {
      const result = await service.delete(1);
      expect(result.message).toBe('Warehouse 1 deleted.');
    });

    it('should throw if warehouse not found', async () => {
      jest.spyOn(warehouseRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(service.delete(999)).rejects.toThrow(BadRequestException);
    });
  });
});
