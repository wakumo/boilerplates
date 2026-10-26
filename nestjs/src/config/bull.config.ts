import type {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { RedisConfig } from './config.js';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(
    @Inject(RedisConfig.KEY)
    private readonly redisConfig: ConfigType<typeof RedisConfig>,
  ) {}
  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: this.redisConfig.baseConfig,
      prefix: this.redisConfig.keyPrefix,
    };
  }
}
