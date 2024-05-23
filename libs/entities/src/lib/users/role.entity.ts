import { Expose } from 'class-transformer';
import BaseEntity from '../base.entity';

export class Role extends BaseEntity {
  @Expose()
  roleName: string;

  static tableName(): string {
    return 'roles';
  }
}

export class UserRole {
  @Expose()
  userId: number;

  @Expose()
  roleId: number;
}
