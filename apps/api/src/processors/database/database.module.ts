import { DynamicModule, Module } from '@nestjs/common';
import { PostgresModuleAsyncOptions, PostgresModuleOptions } from './interfaces';
import { DatabaseCoreModule } from './database-core.module';


@Module({})
export class DatabaseModule {
  public static forRoot(
    options: PostgresModuleOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DatabaseCoreModule.forRoot(options, connection)],
    };
  }

  public static forRootAsync(
    options: PostgresModuleAsyncOptions,
    connection?: string,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DatabaseCoreModule.forRootAsync(options, connection)],
    };
  }
}
