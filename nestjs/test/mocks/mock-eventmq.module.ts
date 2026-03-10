const { AmqpConnection, RabbitMQModule } =
  await import('@golevelup/nestjs-rabbitmq');

import { jest } from '@jest/globals';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitMqConfigService } from '../../src/config/rabbitmq.config.js';
const { EventMqProducer } =
  await import('../../src/rabbitmq/services/eventmq-producer.service.js');
const { EventMqConsumer } =
  await import('../../src/rabbitmq/services/eventmq-consumer.service.js');

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RabbitMqConfigService,
    }),
  ],
  providers: [EventMqProducer, AmqpConnection, EventMqConsumer],
  exports: [EventMqProducer],
})
export class EventMqMockModule {}

jest.unstable_mockModule(
  '../../src/rabbitmq/eventmq-producer.module.js',
  () => EventMqMockModule,
);
