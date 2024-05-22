import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyRequestHandler } from '@trpc/server/adapters/fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TRPC_ROUTER } from '../../common/constants/trpc.constants';

import { createContext } from './trpc.context';
import { tRpc } from './trpc.instance';
import { tRpcRouters } from './trpc.routes';
import { AuthService } from '../../modules/auth/auth.service';
import { BizException } from '../../common/exceptions/biz.exception';
import { ErrorCodeEnum } from '../../common/constants/error-code.constant';

interface TA {
  router: any;
}

type ExtractRouterType<T extends TA> = T['router'];

type MapToRouterType<T extends any[]> = {
  [K in keyof T]: ExtractRouterType<T[K]>;
};

type Routers = MapToRouterType<tRpcRouters>;

@Injectable()
export class tRPCService implements OnModuleInit {
  private logger: Logger;
  private _procedureAuth: typeof tRpc.procedure;
  public appRouter: ReturnType<typeof this.createAppRouter>;

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
    this.logger = new Logger('tRPCService');

    this._procedureAuth = tRpc.procedure.use(
      tRpc.middleware(async (opts) => {
        const authorization = opts.ctx.authorization;
        if (!authorization) {
          throw new BizException(ErrorCodeEnum.AuthFail);
        }

        const result = await this.authService.validate(authorization);
        if (result !== true) {
          throw new BizException(result);
        }
        return opts.next();
      }),
    );
  }

  public get t() {
    return tRpc;
  }

  public get procedureAuth() {
    return this._procedureAuth;
  }

  onModuleInit() {
    this.createAppRouter();
  }

  private createAppRouter() {
    const p = this.discovery.getProviders();
    const routers = p
      .filter((provider) => {
        try {
          return this.reflector.get(TRPC_ROUTER, provider.metatype);
        } catch {
          return false;
        }
      })
      .map(({ instance }) => instance.router)
      .filter((router) => {
        if (!router) {
          this.logger.warn('missing router.');
        }

        return !!router;
      });

    const appRouter = tRpc.mergeRouters(...(routers as any as Routers));

    this.appRouter = appRouter;
    return appRouter;
  }

  applyMiddleware(_app: NestFastifyApplication) {
    _app.getHttpAdapter().all('/trpc/:path', async (req: any, res: any) => {
      const path = (req.params as any).path;
      await fastifyRequestHandler({
        router: this.appRouter,
        createContext,
        req,
        res,
        path,
        onError: (opts) => {
          const { error, type, path, input, ctx, req } = opts;
          this.logger.error(error);
        },
      });
    });
  }
}

