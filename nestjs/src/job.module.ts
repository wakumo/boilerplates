import 'dotenv/config';

import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BullConfigService } from './config/bull.config.js';
import { configurations } from './config/config.js';
import { DatabaseConfigService } from './config/database.config.js';
import { RedisConfigService } from './config/redis.config.js';
import { EventMqAppModule } from './rabbitmq/eventmq-app.module.js';
import { EventMqProducerModule } from './rabbitmq/eventmq-producer.module.js';
import { SCRIPTS } from './scripts/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: configurations }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfigService,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useClass: BullConfigService,
    }),
    ...(process.env.RABBITMQ_MODE === 'true'
      ? [EventMqAppModule]
      : [EventMqProducerModule]),
  ],
  providers: SCRIPTS,
})
export class JobModule {}
