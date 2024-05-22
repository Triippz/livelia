import { Global, Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'

import { tRPCService } from './trpc.service'
import { AuthService } from '../../modules/auth/auth.service';
import DatabaseService from '../database/database.service';
import { UserRepository } from '../../modules/users/repositories/user.repository';

@Module({
  exports: [tRPCService],
  providers: [tRPCService, AuthService, UserRepository, DatabaseService],
  imports: [DiscoveryModule],
})
@Global()
export class tRPCModule {}
