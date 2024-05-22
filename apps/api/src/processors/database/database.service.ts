import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { plainToInstance } from 'class-transformer';
import { InjectPool } from './common';
import { InfinityPaginationResultType } from '../../types/infinity-pagination-result.type';

@Injectable()
class DatabaseService implements OnApplicationShutdown {
  private readonly logger = new Logger('SQL');

  constructor(@InjectPool() private readonly pool: Pool) {}

  // on application shutdown we want to close the pool
  async onApplicationShutdown() {
    await this.pool.end();
  }

  async runQuery(query: string, params?: unknown[]) {
    return this.queryWithLogging(this.pool, query, params);
  }

  getLogMessage(query: string, params?: unknown[]) {
    if (!params) {
      return `Query: ${query}`;
    }
    return `Query: ${query} Params: ${JSON.stringify(params)}`;
  }

  async queryWithLogging(
    source: Pool | PoolClient,
    query: string,
    params?: unknown[],
  ) {
    const queryPromise = source.query(query, params);

    // message without unnecessary spaces and newlines
    const message = this.getLogMessage(query, params)
      .replace(/\n|/g, '')
      .replace(/  +/g, ' ');

    queryPromise
      .then(() => {
        this.logger.debug(message);
      })
      .catch((error) => {
        this.logger.warn(message);
        throw error;
      });

    return queryPromise;
  }

  async getPoolClient() {
    const poolClient = await this.pool.connect();

    return new Proxy(poolClient, {
      get: (target: PoolClient, propertyName: keyof PoolClient) => {
        if (propertyName === 'query') {
          return (query: string, params?: unknown[]) => {
            return this.queryWithLogging(target, query, params);
          };
        }
        return target[propertyName];
      },
    });
  }

  async getPool() {
    return this.pool;
  }

  // This function runs the queries and returns the paginated results
  async runPaginationQueries(
    query: string,
    queryParams: any[],
    countQuery: string,
    countQueryParams: any[],
    limit: number,
    page: number,
    instanceType: any,
  ): Promise<InfinityPaginationResultType<any>> {
    const result = await this.runQuery(query, queryParams);
    const count = await this.runQuery(countQuery, countQueryParams);

    const data = result.rows.slice(0, limit);
    const hasNextPage = result.rows.length > limit; // If there's an extra row, there is a next page.
    const hasPreviousPage = page > 1;
    const totalCount = Number(count.rows[0].count);

    return {
      data: data.map((row) => plainToInstance(instanceType, row)),
      hasNextPage,
      hasPreviousPage,
      totalCount,
    };
  }

  async transactional(
    callback: (client: PoolClient) => Promise<any>,
  ): Promise<any> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

export default DatabaseService;
