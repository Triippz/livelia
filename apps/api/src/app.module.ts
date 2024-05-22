import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './common/config/database.config';
import appConfig from './common/config/app.config';
import { tRPCModule } from './processors/trpc/trpc.module';
import { AuthModule } from './modules/auth/auth.module';
import { HelperModule } from './processors/helpers/helpers.module';
import { UsersModule } from './modules/users/users.module';
import redisConfig from './common/config/redis.config';
import jwtConfig from './common/config/jwt.config';
import { DatabaseModule } from './processors/database/database.module';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager/dist/cache.module';
import { redisStore } from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, redisConfig, jwtConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connectionString: configService.get('database.url'),
        ssl: configService.get('database.sslEnabled'),
      }),
    }),
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          username: configService.get('redis.username'),
          password: configService.get('redis.password'),
          maxRetriesPerRequest: 20,
          ttl: configService.get('redis.ttl'),
          tls: configService.get('redis.sslEnabled'),
          enableTLSForSentinelMode: false
        }),
      })
    }),
    AuthModule,
    tRPCModule,
    HelperModule,
    UsersModule,
    // CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
