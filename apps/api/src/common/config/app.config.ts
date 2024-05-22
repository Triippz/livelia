import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';

export default registerAs<AppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  encryptionKey: process.env.ENCRYPTION_KEY,
}));
