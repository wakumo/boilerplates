import 'dotenv/config';

import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BullConfigService } from './config/bull.config.js';
import { configurations } from './config/config.js';
import { DatabaseConfigService } from './config/database.config.js';
import { RedisConfigService } from './config/redis.config.js';
import { EventMqAppModule } from './rabbitmq/eventmq-app.module.js';
import { EventMqProducerModule } from './rabbitmq/eventmq-producer.module.js';
import { SCRIPTS } from './scripts/index.js';
const imports: Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
> = [];

if (process.env.RABBITMQ_MODE === 'true') {
  imports.push(EventMqAppModule);
}

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
    EventMqProducerModule,
    ...imports,
  ],
  providers: SCRIPTS,
})
export class JobModule {}
