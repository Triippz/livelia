import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../../users/models/enumerations/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
