import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<{ resource: string; action: string }>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !user.roles) throw new ForbiddenException('User not authenticated');

    const hasPermission = user.can(required.resource, required.action);
    if (!hasPermission) throw new ForbiddenException(`Missing permission: ${required.resource}.${required.action}`);

    return true;
  }
}
