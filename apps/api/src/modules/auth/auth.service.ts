import { compareSync } from 'bcrypt'

import { Injectable } from '@nestjs/common';
import { ErrorCodeEnum } from '../../common/constants/error-code.constant';
import { BizException } from '../../common/exceptions/biz.exception';
import { sleep } from '../../utils/tools.utils';
import { JWTService } from '../../processors/helpers/services/helper.jwt.service';
import { UserRepository } from '../users/repositories/user.repository';
import DatabaseService from '../../processors/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JWTService,
    private databaseService: DatabaseService,
  ) {}

  get jwtServicePublic() {
    return this.jwtService
  }

  async validateUsernameAndPassword(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username)

    if (!user || !compareSync(password, user.password)) {
      await sleep(3000)
      throw new BizException(ErrorCodeEnum.AuthFail)
    }

    return user
  }

  async validate(token: string) {
    const jwt = token.replace(/[Bb]earer /, '')

    if (!isJWT(jwt)) {
      return ErrorCodeEnum.JWTInvalid
    }
    const ok = await this.jwtServicePublic.verify(jwt)
    if (!ok) {
      return ErrorCodeEnum.JWTExpired
    }
    return true
  }
}

function isJWT(token: string): boolean {
  const parts = token.split('.')
  return (
    parts.length === 3 &&
    /^[a-zA-Z0-9_-]+$/.test(parts[0]) &&
    /^[a-zA-Z0-9_-]+$/.test(parts[1]) &&
    /^[a-zA-Z0-9_-]+$/.test(parts[2])
  )
}
