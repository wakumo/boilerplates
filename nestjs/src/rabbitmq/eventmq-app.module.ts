import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitMqConfigService } from '../config/rabbitmq.config.js';
import { EventMqConsumer } from './services/eventmq-consumer.service.js';
import { EventMqProducer } from './services/eventmq-producer.service.js';

@Global()
@Module({
  controllers: [],
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RabbitMqConfigService,
    }),
  ],
  providers: [EventMqConsumer, EventMqProducer],
  exports: [EventMqAppModule],
})
export class EventMqAppModule {}
