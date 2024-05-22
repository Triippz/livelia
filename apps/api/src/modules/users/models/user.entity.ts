import { Expose } from 'class-transformer';
import { BaseEntityWithDates } from '../../core/models/base.entity';

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
  slug: string;

  @Expose()
  isActive: boolean;

  @Expose()
  photoUrl: string;

  @Expose()
  roleId: number;

  public static tableName(): string {
    return 'users';
  }
}
