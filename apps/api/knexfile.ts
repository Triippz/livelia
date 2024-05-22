import type { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
// import 'tsconfig-paths/register';

config();

const configService = new ConfigService();

const knexConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    user: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    connectionString: configService.get('DATABASE_URL'),
    ssl: false,
  },
  migrations: {
    directory: './src/database/migrations',
  },
  seeds: {
    // Swap to dev-seeds for local testing
    directory: './src/database/seeds',
  },
};

const knexFileDev: Knex.Config = {
  connection: {
    connectionString: process.env.DATABASE_URL_TEST,
  },
  migrations: {
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
};

module.exports =
  configService.get('nodeEnv') === 'development' ? knexFileDev : knexConfig;

// let configFile;
// if (process.env.NODE_ENV === 'development') {
//   console.log('Using dev config')
//   configFile = knexFileDev;
// } else {
//   console.log('Using knex config')
//   configFile = knexConfig;
// }
//
// module.exports = configFile;
