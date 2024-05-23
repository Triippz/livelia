export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_HOLD = 'ON_HOLD',
  PENDING_ACTIVATION = 'PENDING_ACTIVATION',
}

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_HOLD: 'ON_HOLD',
  PENDING_ACTIVATION: 'PENDING_ACTIVATION',
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
