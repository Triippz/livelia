export type AppConfig = {
  nodeEnv: string;
  encryptionKey: string;
};

export type RedisConfig = {
  url?: string;
  host?: string;
  port?: number;
  username?: string | null;
  password?: string | null;
  ttl?: number | null;
  httpCacheTTL?: number;
  max?: number;
  sslEnabled?: boolean;
}

export type DatabaseConfig = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
};

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
};

export type JWTConfig = {
  secretKey: string;
  jwtExpire: string;
}
