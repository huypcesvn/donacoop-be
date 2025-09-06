import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindOneOptions, In, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/role.entity';
import { Company } from '../companies/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Company) private companyRepository: Repository<Company>
  ) {}

  async handleRegister(registerDto: RegisterDto) {
    const { fullName, username, password } = registerDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (user) throw new BadRequestException('This phone number has already been taken.');

    const hashedPassword = await argon2.hash(password);
    const newUser = await this.userRepository.create({ fullName, username, password: hashedPassword });
    await this.userRepository.save(newUser);

    return { id: newUser.id, username, fullName };
  }

  async findAll(page: number = 1, limit: number = 2, keyword?: string, role?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.company', 'company')
      .orderBy('role.id', 'ASC')
      .addOrderBy('user.fullName', 'ASC');

    if (keyword) {
      queryBuilder.where('user.fullName ILIKE :keyword OR user.username ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    if (role) queryBuilder.andWhere('role.name = :role', { role });

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  findOneById(id: number, options?: FindOneOptions<User>) {
    return this.userRepository.findOne({
      where: { id },
      ...options,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    if (existingUser) throw new BadRequestException('Username is already taken.');

    createUserDto.password = await argon2.hash(createUserDto.password || User.DEFAULT_PASSWORD);

    const { roles, companyId, ...userData } = createUserDto;
    const newUser = this.userRepository.create(userData);

    if (companyId) {
      const company = await this.companyRepository.findOne({ where: { id: companyId } });
      if (!company) throw new BadRequestException('Company not found.');
      newUser.company = company;
    }
    if (roles?.length) newUser.roles = await this.roleRepository.findBy({ id: In(roles) });

    return this.userRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto, userRequested: User) {
    // if (id !== userRequested.id) throw new UnauthorizedException('Only account owner is allowed.');

    const user = await this.findOneById(id, {
      relations: ['roles'], // load luôn roles để tránh ghi đè sai
    });
    if (!user) throw new BadRequestException('User not found.');

    if (updateUserDto.password) updateUserDto.password = await argon2.hash(updateUserDto.password);

    const { roles, companyId, ...updateData } = updateUserDto;
    Object.assign(user, updateData);

    if (roles !== undefined) {
      if (roles.length) {
        const foundRoles = await this.roleRepository.findBy({ id: In(roles) });
        user.roles = foundRoles;
      } else {
        user.roles = [];  // nếu truyền mảng rỗng => xóa hết roles
      }
    }
    if (companyId) {
      const company = await this.companyRepository.findOne({ where: { id: companyId } });
      if (!company) throw new BadRequestException('Company not found.');
      user.company = company;
    }

    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.findOneById(id);
    if (!user) throw new BadRequestException('User not found.');

    await this.userRepository.remove(user);
    return { message: `User with id ${id} has been deleted.` };
  }
}
