
import { Injectable, OnModuleInit } from '@nestjs/common'
import { TRPCRouter } from '../../../common/decorators/trpc.decorator';
import { tRPCService } from '../../../processors/trpc/trpc.service';
import { defineTrpcRouter } from '../../../processors/trpc/trpc.helper';

@TRPCRouter()
@Injectable()
export class UserTrpcRouter implements OnModuleInit {
  private router: ReturnType<typeof this.createRouter>
  constructor(private readonly trpcService: tRPCService) {}

  onModuleInit() {
    this.router = this.createRouter()
  }

  private createRouter() {
    const t = this.trpcService.protectedProcedure()
    return defineTrpcRouter('user', {
      user: t.query(() => []),
    })
  }
}
