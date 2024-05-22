import { isObservable, Observable, of } from 'rxjs';
import { delay, retryWhen, scan, mergeMap } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';
import { Logger } from '@nestjs/common';
import { CircularDependencyException } from '@nestjs/core/errors/exceptions';
import { PostgresModuleOptions } from '../interfaces';
import { DEFAULT_CONNECTION_NAME } from '../constants/postgres.constants';

const logger = new Logger('PostgresModule');

export function getDbToken(
  database: () => string,
  connection: PostgresModuleOptions | string = DEFAULT_CONNECTION_NAME,
) {
  if (database === null || database === undefined) {
    throw new CircularDependencyException('@InjectClient()');
  }
  const connectionPrefix = getConnectionPrefix(connection);
  return `${connectionPrefix}${database.name}`;
}

export function getConnectionToken(
  connection: PostgresModuleOptions | string = DEFAULT_CONNECTION_NAME,
): string | (() => string) {
  if (typeof connection === 'string') {
    return connection;
  }
  return connection.name || DEFAULT_CONNECTION_NAME;
}

export function getConnectionPrefix(
  connection: PostgresModuleOptions | string = DEFAULT_CONNECTION_NAME,
): string {
  if (connection === DEFAULT_CONNECTION_NAME) {
    return '';
  }
  if (typeof connection === 'string') {
    return connection + '_';
  }
  if (connection.name === DEFAULT_CONNECTION_NAME || !connection.name) {
    return '';
  }
  return connection.name + '_';
}

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  return <T>(source: Observable<T>) => {
    if (!isObservable(source)) {
      throw new Error('Source must be an Observable');
    }

    return source.pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((errorCount, error: Error) => {
            logger.error(
              `Unable to connect to the database. Retrying (${errorCount + 1})...`,
              error.stack,
            );
            if (errorCount + 1 >= retryAttempts) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          mergeMap((errorCount) => of(errorCount).pipe(delay(retryDelay))),
        ),
      ),
    );
  };
}

export function getConnectionName(options: PostgresModuleOptions) {
  return options && options.name ? options.name : DEFAULT_CONNECTION_NAME;
}

export const generateString = () => randomUUID();
