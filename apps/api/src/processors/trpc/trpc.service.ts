import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyRequestHandler } from '@trpc/server/adapters/fastify';
import { TRPC_ROUTER } from '../../common/constants/trpc.constants';

import { createContext } from './trpc.context';
import { tRpc } from './trpc.instance';
import { tRpcRouters } from './trpc.routes';
import { AuthService } from '../../modules/auth/auth.service';
import { BizException } from '../../common/exceptions/biz.exception';
import { ErrorCodeEnum } from '../../common/constants/error-code.constant';
import { RolesEnum } from '@livelia/entities';
import { UserAccessTokenClaims } from '@livelia/dtos';

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
  private logger = new Logger('tRPCService');
  public appRouter: ReturnType<typeof this.createAppRouter>;

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  get t() {
    return tRpc;
  }

  publicProcedure() {
    return tRpc.procedure;
  }

  protectedProcedure(allowedRoles: RolesEnum[] = []) {
    return tRpc.procedure.use(
      tRpc.middleware(async (opts) => {
        const { authorization, ipLocation } = opts.ctx;


        if (!authorization) {
          throw new BizException(ErrorCodeEnum.AuthFail);
        }

        const result = await this.authService.validate(authorization);
        if (result !== true) {
          throw new BizException(result);
        }

        const userClaims = this.getUserClaimsFromToken(authorization);
        if (allowedRoles.length > 0 && !this.isRoleAllowed(userClaims.roles, allowedRoles)) {
          throw new BizException(ErrorCodeEnum.NotAuthorized);
        }

        return opts.next({
          ctx: {
            ...opts.ctx,
            user: userClaims,
            ipLocation
          },
        });
      }),
    );
  }

  private getUserClaimsFromToken(token: string): UserAccessTokenClaims {
    // Decode the token and extract user roles. This is just a placeholder implementation.
    return this.authService.decodeToken(token);
  }

  private isRoleAllowed(userRoles: RolesEnum[], allowedRoles: RolesEnum[]): boolean {
    return userRoles.some((role) => allowedRoles.includes(role));
  }

  onModuleInit() {
    this.createAppRouter();
  }

  private createAppRouter() {
    const providers = this.discovery.getProviders();
    const routers = providers
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

  applyMiddleware(app: NestFastifyApplication) {
    app.getHttpAdapter().all('/trpc/:path', this.createRequestHandler());
  }

  private createRequestHandler() {
    return async (req: any, res: any) => {
      const path = (req.params as any).path;
      await fastifyRequestHandler({
        router: this.appRouter,
        createContext,
        req,
        res,
        path,
        onError: (opts) => {
          const { error } = opts;
          this.logger.error(error);
        },
      });
    };
  }
}
