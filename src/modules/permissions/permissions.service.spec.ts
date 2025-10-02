import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionsService } from './permissions.service';
import { Permission } from './permission.entity';
import { NotFoundException } from '@nestjs/common';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repo: jest.Mocked<Repository<Permission>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    repo = module.get(getRepositoryToken(Permission));
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const perms = [{ id: 1, resource: 'user', action: 'read' }] as Permission[];
      repo.find.mockResolvedValue(perms);

      const result = await service.findAll();

      expect(result).toEqual(perms);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and save permission', async () => {
      const dto = { resource: 'user', action: 'create' };
      const entity = { id: 1, ...dto } as Permission;

      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(result).toEqual(entity);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('delete', () => {
    it('should delete permission if exists', async () => {
      const entity = { id: 1, resource: 'user', action: 'delete' } as Permission;
      repo.findOne.mockResolvedValue(entity);
      repo.remove.mockResolvedValue(entity);

      const result = await service.delete(1);

      expect(result).toEqual(entity);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.remove).toHaveBeenCalledWith(entity);
    });

    it('should throw NotFoundException if permission not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
