import { Expose } from 'class-transformer';

export abstract class BaseEntity {
  id: number;
}

export abstract class BaseEntityWithDates extends BaseEntity {
  @Expose({ name: 'created_at' })
  createdAt?: Date;
  @Expose({ name: 'updated_at' })
  updatedAt?: Date;
}

export default BaseEntity;
