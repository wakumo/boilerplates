import { RedisModule } from '@liaoliaots/nestjs-redis';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CacheManagerModule } from './commons/cache-manager/cache-manager.module.js';
import { AppLoggerMiddleware } from './commons/middlewares/app-logger.middleware.js';
import { UtilsModule } from './commons/utils/utils.module.js';
import { BullConfigService } from './config/bull.config.js';
import { configurations } from './config/config.js';
import { DatabaseConfigService } from './config/database.config.js';
import { RedisConfigService } from './config/redis.config.js';
import { EventMqProducerModule } from './rabbitmq/eventmq-producer.module.js';
import { SampleModule } from './v1/sample/sample.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    TerminusModule,
    EventMqProducerModule,
    UtilsModule,
    CacheManagerModule,
    SampleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
