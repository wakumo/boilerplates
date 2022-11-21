import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RabbitMqConfigService } from "../config/rabbitmq.config.js";
import { EventMqConsumerModule } from "./event-consumer/eventmq-consumer.module.js";
import { EventMqProducer } from "./eventmq.producer.js";

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useClass: RabbitMqConfigService
    }),
    EventMqConsumerModule
  ],
  providers: [EventMqProducer],
  exports: [EventMqProducer]
})
export class EventMqModule { }