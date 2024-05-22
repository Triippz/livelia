import { registerAs } from '@nestjs/config';
import { RedisConfig } from './config.type';
import * as process from 'node:process';

export default registerAs<RedisConfig>('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  username: process.env.REDIS_USERNAME || null,
  password: process.env.REDIS_PASSWORD || null,
  ttl: parseInt(process.env.REDIS_TTL, 10) || null,
  httpCacheTTL: parseInt(process.env.REDIS_HTTP_CACHE_TTL, 10) || 5,
  max: parseInt(process.env.REDIS_MAX, 10) || 5,
  sslEnabled: process.env.REDIS_SSL_ENABLED === 'true',
}));
