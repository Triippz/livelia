import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/role.decorator';
import { BizException } from '../../../common/exceptions/biz.exception';
import { ErrorCodeEnum } from '../../../common/constants/error-code.constant';
import { RolesEnum as Roles } from '../../users/models/enumerations/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<
          Roles[]
        >(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        if (
          requiredRoles.some((appRole) =>
                user.appRole === appRole
            )
        ) {
            return true;
        }

        throw new BizException(
          ErrorCodeEnum.InsufficientPermissions,
        );
    }
}