
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as string,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneById(payload.sub, {
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) throw new UnauthorizedException();
    console.log(`------ inject vào request.user(${user.username}, ${user.fullName}) permissions:`, user.roles[0]?.permissions.map(perm => `${perm.resource}.${perm.action}`))

    return user; // inject vào request.user
  }
}
