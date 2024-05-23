import { TRPCRouter } from '../../common/decorators/trpc.decorator';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { tRPCService } from '../../processors/trpc/trpc.service';
import { defineTrpcRouter } from '../../processors/trpc/trpc.helper';
import { UserService } from '../users/services/user.service';
import { BizException } from '../../common/exceptions/biz.exception';
import { ErrorCodeEnum } from '../../common/constants/error-code.constant';
import { ChangePasswordDto, AuthLoginInputDto, CreateUserDto, CheckUsernameDto } from '@livelia/dtos';
import { AuthService } from './auth.service';

@TRPCRouter()
@Injectable()
export class UserTrpcRouter implements OnModuleInit {
  private router: ReturnType<typeof this.createRouter>;

  LOG: Logger = new Logger(UserTrpcRouter.name);

  constructor(
    private readonly trpcService: tRPCService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {
  }

  onModuleInit() {
    this.router = this.createRouter();
  }

  private createRouter() {
    const protectedProcedure = this.trpcService.protectedProcedure;
    const publicProcedure = this.trpcService.publicProcedure;

    return defineTrpcRouter('auth', {
      login: publicProcedure()
        .input(AuthLoginInputDto)
        .mutation(async ({ input, ctx }) => {
          return this.authService.login(input, ctx.ipLocation);
        }),

      loginWithToken: protectedProcedure()
        .mutation(async ({ ctx }) => {
          await this.userService.recordFootstep(ctx.user.id, ctx.ipLocation.ip);
          const tokenOutput = await this.authService.getAuthToken(
            ctx.user,
            ctx.user.roles,
            ctx.ipLocation
          );

          await this.authService.revokeToken(ctx.authToken);
          return tokenOutput;
        }),

      register: publicProcedure()
        .input(CreateUserDto)
        .mutation(async ({ input, ctx }) => {
          const user = await this.authService.register(input);
          return this.authService.getAuthToken(user, user.roles, ctx.ipLocation);
        }),

      changePassword: protectedProcedure()
        .input(ChangePasswordDto)
        .mutation(async ({ input, ctx }) => {
          this.userService
            .validateUserPassword(ctx.user.id, input.oldPassword)
            .then((user) => {
              this.userService.updatePassword(
                user.id,
                input.newPassword
              );
            })
            .catch((err) => {
              this.LOG.error(err);
              throw new BizException(ErrorCodeEnum.InvalidCredentials);
            });
        }),

      checkUsername: publicProcedure()
        .input(CheckUsernameDto)
        .query(async ({ input }) => {
          const maybeUser = await this.userService.checkUsername(input.username);
          return !!maybeUser;
        }),

      getCurrentUser: protectedProcedure()
        .query(async ({ ctx }) => {
          return this.userService.findById(ctx.user.id)
        })
    });
  }
}
