import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

import { verify } from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            handleRegister: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('returns null if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('username', 'password');
      expect(result).toBeNull();
    });

    it('returns null if password is invalid', async () => {
      const fakeUser = { username: 'test', password: 'hashed' } as User;
      userRepository.findOne.mockResolvedValue(fakeUser);
      (verify as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test', 'wrongpass');
      expect(result).toBeNull();
    });

    it('returns user if password is valid', async () => {
      const fakeUser: Partial<User> = { username: 'test', password: 'hashed', roles: [] };
      userRepository.findOne.mockResolvedValue(fakeUser as User);
      (verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test', 'correct');
      expect(result).toEqual(fakeUser);
    });
  });

  describe('login', () => {
    it('returns access_token and userInfo', async () => {
      const fakeUser = {
        id: 1,
        username: 'john',
        fullName: 'John Doe',
        roles: [{ name: 'admin' }],
      } as any;

      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.login(fakeUser);
      expect(result.access_token).toBe('signed-token');
      expect(result.userInfo).toEqual({
        id: 1,
        username: 'john',
        name: 'John Doe',
        roles: ['admin'],
      });
    });
  });

  describe('getProfile', () => {
    it('throws if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile({ id: 1 })).rejects.toThrow(UnauthorizedException);
    });

    it('returns user profile with roles', async () => {
      const fakeUser = {
        id: 1,
        username: 'john',
        fullName: 'John Doe',
        roles: [{ name: 'admin' }],
      } as User;

      userRepository.findOne.mockResolvedValue(fakeUser);

      const result = await service.getProfile({ id: 1 });
      expect(result).toEqual({
        id: 1,
        username: 'john',
        name: 'John Doe',
        roles: ['admin'],
      });
    });
  });

  describe('register', () => {
    it('calls usersService.handleRegister', async () => {
      const dto = { username: 'john' } as any;
      const createdUser: Partial<User> = { id: 1, username: 'john', fullName: 'John Doe' };

      usersService.handleRegister.mockResolvedValue(createdUser as User);

      const result = await service.register(dto);
      expect(result).toBe(createdUser);
      expect(usersService.handleRegister).toHaveBeenCalledWith(dto);
    });
  });
});
