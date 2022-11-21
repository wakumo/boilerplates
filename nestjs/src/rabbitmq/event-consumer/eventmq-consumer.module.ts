import { Module } from "@nestjs/common";
import { EventMqConsumerService } from "./eventmq-consumer.service";

// imports
@Module({
  providers: [EventMqConsumerService]
})
export class EventMqConsumerModule { }