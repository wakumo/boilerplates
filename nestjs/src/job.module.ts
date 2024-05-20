import { RedisModule } from "@liaoliaots/nestjs-redis";
import { BullModule } from "@nestjs/bull";
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TerminusModule } from "@nestjs/terminus";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AppLoggerMiddleware } from "./commons/middlewares/app-logger.middleware.js";
import { BullConfigService } from "./config/bull.config.js";
import { configuration } from "./config/config.js";
import { DatabaseConfigService } from "./config/database.config.js";
import { RedisConfigService } from "./config/redis.config.js";
import { SCRIPTS } from "./scripts/index.js";
import { EventMqAppModule } from "./rabbitmq/eventmq-app.module.js";
import { EventMqProducerModule } from "./rabbitmq/eventmq-producer.module.js";
const imports = [];
if (process.env.RABBITMQ_MODE === "true") {
  imports.push(EventMqAppModule);
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
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
      inject: [ConfigService],
    }),
    TerminusModule,
    EventMqProducerModule,
    ...imports
  ],
  controllers: [AppController],
  providers: [AppService, ...SCRIPTS],
})
export class JobModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
