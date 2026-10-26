import type {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { RedisConfig } from './config.js';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(
    @Inject(RedisConfig.KEY)
    private readonly redisConfig: ConfigType<typeof RedisConfig>,
  ) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      closeClient: true,
      config: {
        ...this.redisConfig.baseConfig,
        keyPrefix: this.redisConfig.keyPrefix,
      },
    };
  }
}
