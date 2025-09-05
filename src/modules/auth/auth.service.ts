import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, plainPassword: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles']
    });
    if (!user) return null;

    const isValidPassword = await verify(user.password, plainPassword);
    if (!isValidPassword) return null;

    return user;
  }

  async login(user: User) {
    const roles = user.roles?.map(role => role.name) || [];
    console.log('User roles:', roles); // Debug log
    const payload = {
      sub: user.id,
      username: user.username,
      roles: roles
    };
    const userInfo = {
      id: user.id,
      username: user.username,
      name: user.fullName,
      roles: roles
    };
    return { userInfo, access_token: this.jwtService.sign(payload) };
  }

  async getProfile(user: any) {
    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['roles']
    });

    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    const roles = fullUser.roles?.map(role => role.name) || [];
    return {
      id: fullUser.id,
      username: fullUser.username,
      name: fullUser.fullName,
      roles: roles
    };
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.handleRegister(registerDto)
  }
}
