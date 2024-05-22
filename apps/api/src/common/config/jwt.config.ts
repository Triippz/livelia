import { registerAs } from '@nestjs/config';
import { JWTConfig } from './config.type';

export default registerAs<JWTConfig>('jwt', () => ({
  secretKey: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '1d',
}));
