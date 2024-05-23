import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, Put,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "../decorators/public.decorator";
import {
  AuthTokenOutput,
  ChangePasswordDtoType,
  CreateUserDtoType,
  AuthLoginInputDtoType
} from '@livelia/dtos';
import { AuthService } from '../auth.service';
import { User } from '@livelia/entities';
import { UserId } from '../decorators/user-id.decorator';
import { CurrentToken, CurrentUser } from '../../users/decorators/user.decorator';
import { Throttle } from '@nestjs/throttler';
import { IpLocation, IpRecord } from '../../../common/constants/ip.decorator';
import { UserService } from '../../users/services/user.service';
import { BizException } from '../../../common/exceptions/biz.exception';
import { ErrorCodeEnum } from '../../../common/constants/error-code.constant';

@ApiTags("auth")
@Controller("auth/v1")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  private readonly userService: UserService
  ) {
  }

  @Post("login")
  @Public()
  @Throttle({
    default: {
      limit: 5,
      ttl: 1_000,
    },
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() credentials: AuthLoginInputDtoType,
    @IpLocation() ipLocation: IpRecord
  ): Promise<AuthTokenOutput> {
    return await this.authService.login(
      credentials,
      ipLocation
    );
  }

  @Put('/login')
  @ApiBearerAuth()
  async loginWithToken(
    @IpLocation() ipLocation: IpRecord,
    @CurrentUser() user: User,
    @CurrentToken() token: string,
  ) {
    await this.userService.recordFootstep(user.id, ipLocation.ip)
    const tokenOutput = await this.authService.getAuthToken(user, user.roles, ipLocation);

    await this.authService.revokeToken(token)
    return tokenOutput;
  }

  @Post("register")
  @Public()
  @ApiOperation({
    summary: "User registration API"
  })
  async registerLocal(
    @Body() input: CreateUserDtoType,
    @IpLocation() ipLocation: IpRecord,
  ): Promise<AuthTokenOutput> {
    const user = await this.authService.register(input);
    return this.authService.getAuthToken(user, user.roles, ipLocation);
  }


  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Post("change-password")
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: User,
    @Body() input: ChangePasswordDtoType
  ): Promise<void> {
    if (!user) {
      throw new BizException(ErrorCodeEnum.NotAuthorized);
    }

    this.userService
      .validateUserPassword(user.id, input.oldPassword)
      .then((user) => {
        this.userService.updatePassword(
          user.id,
          input.newPassword
        );
      })
      .catch((err) => {
        throw new BizException(ErrorCodeEnum.InvalidCredentials);
      });
  }

  @Get("/check-username/:username")
  @Public()
  async checkUsername(
    @Param("username") username: string
  ): Promise<{ available: boolean }> {
    const isUsernameAvailable = await this.userService.checkUsername(
      username
    );
    return {
      available: !isUsernameAvailable
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(
    @UserId() userId: number
  ): Promise<User> {
    return await this.authService.getCurrentUser(userId);
  }
}
