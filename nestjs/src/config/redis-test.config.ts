import type {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisTestConfigService implements RedisOptionsFactory {
  createRedisOptions(): RedisModuleOptions {
    return {
      closeClient: true,
      config: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        keyPrefix: `boilerplate:test:${process.env.JEST_WORKER_ID ?? '1'}:`,
      },
    };
  }
}
