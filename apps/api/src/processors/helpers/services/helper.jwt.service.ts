import { sign, verify } from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { getRedisKey } from '../../../utils/redis.util';
import { RedisKeys } from '../../../common/constants/cache.constant';
import { md5 } from '@nestjs/throttler/dist/hash';
import { ConfigService } from '@nestjs/config';
import { isDev } from '../../../common/config/config.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JWTService {
  private secret = '';

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {
    this.init();
  }

  init() {
    if (this.secret) {
      return;
    }

    const ENCRYPT_KEY = this.configService.get<string>('app.encryptionKey');

    const secret =
      this.configService.get<string>('jwt.secretKey') ||
      Buffer.from(ENCRYPT_KEY || '').toString('base64').slice(0, 15) ||
      'asjhczxiucipoiopiqm2376';

    this.secret = secret;
  }

  async verify(token: string): Promise<boolean> {
    try {
      verify(token, this.secret);
      if (isDev) return true;
      return await this.isTokenInCache(token);
    } catch (err) {
      console.debug(err, token);
      return false;
    }
  }

  async isTokenInCache(token: string): Promise<boolean> {
    const key = getRedisKey(RedisKeys.JWTStore);
    const has = await this.cacheService.get(md5(token));
    return !!has;
  }

  async getAllSignSession(currentToken?: string): Promise<any[]> {
    const res = await this.cacheService.get<{ [key: string]: string }>(getRedisKey(RedisKeys.JWTStore));
    const hashedCurrent = currentToken && md5(currentToken);
    return res
      ? Object.entries(res).map(([k, v]) => ({
        ...JSON.parse(v),
        id: `jwt-${k}`,
        current: hashedCurrent === k,
      }))
      : [];
  }

  async revokeToken(token: string, delay?: number): Promise<void> {
    const key = getRedisKey(RedisKeys.JWTStore);
    const hashedToken = token.startsWith(`jwt-`) ? token.replace(`jwt-`, '') : md5(token);
    if (delay) {
      setTimeout(() => {
        this.cacheService.del(hashedToken);
      }, delay);
    } else {
      await this.cacheService.del(hashedToken);
    }
  }

  async revokeAll(): Promise<void> {
    const key = getRedisKey(RedisKeys.JWTStore);
    await this.cacheService.del(key);
  }

  async storeTokenInCache(token: string, info?: any): Promise<void> {
    await this.cacheService.set(
      md5(token),
      JSON.stringify({
        date: new Date().toISOString(),
        ...info,
      } as StoreJWTPayload),
      this.configService.get<number>('jwt.expire'),
    );
  }

  public readonly expiresDay = this.configService.get<string>('jwt.expire');

  async sign(id: string, info?: { ip: string; ua: string }): Promise<string> {
    const token = sign({ id }, this.secret, {
      expiresIn: this.expiresDay,
    });
    await this.storeTokenInCache(token, info || {});
    return token;
  }
}

export interface StoreJWTPayload {
  /**
   * ISODateString
   */
  date: string;
  [k: string]: any;
}
