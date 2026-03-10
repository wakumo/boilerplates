import {
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
      redis: {
        host: this.redisConfig.host,
        port: this.redisConfig.port,
        keyPrefix: 'boilerplate:',
      },
    };
  }
}
