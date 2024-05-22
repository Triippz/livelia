import { OnModuleInit } from '@nestjs/common'
import { CreateRouterInner } from '@trpc/server'

interface TRPCWithRouter {
  createRouter(): CreateRouterInner<never, never>
}

export abstract class TRPCRouterBase implements OnModuleInit, TRPCWithRouter {
  protected abstract router: ReturnType<typeof this.createRouter>

  abstract createRouter(): CreateRouterInner<never, never>

  onModuleInit() {
    this.router = this.createRouter()
  }
}
