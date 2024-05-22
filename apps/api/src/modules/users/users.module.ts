import { Module, forwardRef } from '@nestjs/common';
import { UserTrpcRouter } from './routers/users.router';
import { UserService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import DatabaseService from '../../processors/database/database.service';
import { JWTService } from '../../processors/helpers/services/helper.jwt.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserTrpcRouter,
    UserRepository,
    DatabaseService,
    JWTService,
  ],
  imports: [
    forwardRef(() => AuthModule),
  ],
  exports: [UserService, UserTrpcRouter, UserRepository],
})
export class UsersModule {}
