import { Global, Module, Provider } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JWTService } from './services/helper.jwt.service';
import { ConfigModule } from '@nestjs/config';

const providers: Provider[] = [
  JWTService,
];

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),
  ],
  providers,
  exports: providers,
})
@Global()
export class HelperModule {}
