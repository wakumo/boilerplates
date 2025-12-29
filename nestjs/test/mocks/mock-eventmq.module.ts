import { AmqpConnection, RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventMqProducer } from '../../src/rabbitmq/services/eventmq-producer.service.js';
import { RabbitMqConfigService } from '../../src/config/rabbitmq.config.js';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RabbitMqConfigService
    })
  ],
  providers: [EventMqProducer, AmqpConnection],
  exports: [EventMqProducer]
})
export class EventMqMockModule { }

jest.mock("@/src/rabbitmq/eventmq-producer.module", () => EventMqMockModule)
