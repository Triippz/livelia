import { compareSync, hashSync } from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { ErrorCodeEnum } from '../../common/constants/error-code.constant';
import { BizException } from '../../common/exceptions/biz.exception';
import { sleep } from '../../utils/tools.utils';
import { JWTService } from '../../processors/helpers/services/helper.jwt.service';
import { UserRepository } from '../users/repositories/user.repository';
import DatabaseService from '../../processors/database/database.service';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
  AuthLoginInputDtoType,
  CreateUserDtoType
} from '@livelia/dtos';
import { IpRecord } from '../../common/constants/ip.decorator';
import { RolesEnum, User } from '@livelia/entities';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JWTService,
    private databaseService: DatabaseService
  ) {
  }

  async login(
    credential: AuthLoginInputDtoType,
    ipLocation: IpRecord
  ): Promise<AuthTokenOutput> {
    // An unauthorized error will bubble up if the user is not found or the password is incorrect.
    const user = await this.validateUsernameAndPassword(
      credential.username,
      credential.password
    );

    return this.getAuthToken(user, user.roles, ipLocation);
  }

  async register(input: CreateUserDtoType) {
    const maybeUser = await this.userRepository.findByEmail(input.email);
    if (maybeUser) {
      throw new BizException(ErrorCodeEnum.UserExist);
    }

    input.password = hashSync(input.password, 10);
    return await this.userRepository.create(input);
  }

  async validateUsernameAndPassword(username: string, password: string) {
    const user = await this.userRepository.findByUsernameHydrateRoles(username);

    if (!user || !compareSync(password, user.password)) {
      await sleep(3000);
      throw new BizException(ErrorCodeEnum.AuthFail);
    }

    return user;
  }

  async validate(token: string) {
    const jwt = token.replace(/[Bb]earer /, '');

    if (!isJWT(jwt)) {
      return ErrorCodeEnum.JWTInvalid;
    }
    const ok = await this.jwtService.verify(jwt);
    if (!ok) {
      return ErrorCodeEnum.JWTExpired;
    }
    return true;
  }

  async getAuthToken(user: User | UserAccessTokenClaims, roles: RolesEnum[], ipLocation: IpRecord): Promise<AuthTokenOutput> {
    const jwt = await this.jwtService.sign({
      id: user.id,
      username: user.username,
      roles: roles
    }, {
      ip: ipLocation.ip,
      ua: ipLocation.agent
    });

    return {
      accessToken: jwt
    } as AuthTokenOutput;

  }

  async revokeToken(token: string) {
    await this.jwtService.revokeToken(token, 6000)
  }

  async getCurrentUser(userId: number) {
    return this.userRepository.findById(userId);
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}

function isJWT(token: string): boolean {
  const parts = token.split('.');
  return (
    parts.length === 3 &&
    /^[a-zA-Z0-9_-]+$/.test(parts[0]) &&
    /^[a-zA-Z0-9_-]+$/.test(parts[1]) &&
    /^[a-zA-Z0-9_-]+$/.test(parts[2])
  );
}
