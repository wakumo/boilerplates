import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConsumeMessage, Channel } from 'amqplib'

@Injectable()
export class EventMqConsumerService {
  constructor() { }

  @RabbitSubscribe({
    exchange: "sample_exchange",
    routingKey: "sample.routing_key.*",
    queue: "sample_queue",
    errorHandler: (channel: Channel, msg: ConsumeMessage, error: Error) => {
      console.log(error);
      channel.reject(msg, false);
    }
  })
  public async getSampleMessage(msg: {}, amqpMsg: ConsumeMessage) {
    console.log("go here");
    const data = JSON.parse(amqpMsg.content.toString())
    console.log(data);
  }
}