import { Inject } from '@nestjs/common';
import { getConnectionToken } from './postgres.utils';
import { PostgresModuleOptions } from '../interfaces';

export const InjectClient = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectPool = (connection?: string) => {
  return Inject(getConnectionToken(connection));
};

export const InjectConnection: (
  connection?: PostgresModuleOptions | string,
) => ParameterDecorator = (connection?: PostgresModuleOptions | string) =>
  Inject(getConnectionToken(connection));
