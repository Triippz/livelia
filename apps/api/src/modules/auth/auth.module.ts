import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import DatabaseService from '../../processors/database/database.service';
import { STRATEGY_JWT_AUTH } from '../../common/constants/strategy.constant';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule, JwtModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'), // Use your env var name
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'), // Eg: 60, "2 days", "10h", "7d"
        },
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, DatabaseService],
  exports: [AuthService],
})
export class AuthModule {}
