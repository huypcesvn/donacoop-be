import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async handleRegister(registerDto: RegisterDto) {
    const { fullName, username, password } = registerDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (user) throw new BadRequestException('This phone number has already been taken.');

    const hashedPassword = await argon2.hash(password);
    const newUser = await this.userRepository.create({ fullName, username, password: hashedPassword });
    await this.userRepository.save(newUser);

    return { id: newUser.id, username, fullName };
  }

  findById(id: number, options?: FindOneOptions<User>) {
    return this.userRepository.findOne({
      where: { id },
      ...options,
    });
  }
}
