import IORedis, { Redis, RedisOptions } from 'ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isTest } from '../../../common/config/config.utils';

const logger = new Logger('SubscribeService');

type SubscribeCallback = (data: any) => void;

@Injectable()
export class SubscribeService {
  public pubClient: Redis;
  public subClient: Redis;
  private ctc = new WeakMap<SubscribeCallback, (channel: string, message: string) => void>();

  constructor(
    private readonly configService: ConfigService,
    private channelPrefix = 'livelia-channel#',
  ) {
    if (!isTest()) {
      this.init();
    }
  }

  public init() {
    const maybeRedisUrl = this.configService.get<string>('redis.url');

    if (maybeRedisUrl) {
      this.pubClient = new IORedis(maybeRedisUrl);
      this.subClient = this.pubClient.duplicate();
    } else {
      const redisOptions: RedisOptions = {
        host: this.configService.get<string>('redis.host'),
        port: this.configService.get<number>('redis.port'),
      };

      const maybeRedisPassword = this.configService.get<string>('redis.password');
      if (maybeRedisPassword) {
        redisOptions.password = maybeRedisPassword;
      }

      this.pubClient = new IORedis(redisOptions);
      this.subClient = this.pubClient.duplicate();
    }
  }

  public async publish(event: string, data: any) {
    const channel = this.channelPrefix + event;
    const _data = JSON.stringify(data);
    logger.debug(`Publish event: ${channel} <- ${_data}`);
    await this.pubClient.publish(channel, _data);
  }

  public async subscribe(event: string, callback: SubscribeCallback) {
    const myChannel = this.channelPrefix + event;
    this.subClient.subscribe(myChannel);

    const cb = (channel: string, message: string) => {
      if (channel === myChannel) {
        logger.debug(`Received event: ${channel} -> ${message}`);
        callback(JSON.parse(message));
      }
    };

    this.ctc.set(callback, cb);
    this.subClient.on('message', cb);
  }

  public async unsubscribe(event: string, callback: SubscribeCallback) {
    const channel = this.channelPrefix + event;
    this.subClient.unsubscribe(channel);
    const cb = this.ctc.get(callback);
    if (cb) {
      this.subClient.off('message', cb);
      this.ctc.delete(callback);
    }
  }
}
