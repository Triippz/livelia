import { Expose } from 'class-transformer';
import { BaseEntityWithDates } from '../base.entity';
import { RolesEnum } from './enumerations/roles.enum';

export class User extends BaseEntityWithDates {
  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose()
  status: string;

  @Expose()
  lastLogin: Date;

  @Expose()
  lastLoginIp: string;

  @Expose()
  slug: string;

  @Expose()
  isActive: boolean;

  @Expose()
  photoUrl: string;

  @Expose()
  roles?: RolesEnum[];

  public static tableName(): string {
    return 'users';
  }
}
