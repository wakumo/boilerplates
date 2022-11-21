import { RabbitRPC, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ConsumeMessage, Channel } from 'amqplib'

function errorHandler(channel: Channel, msg: ConsumeMessage, error: Error) {
  console.log(error);
  channel.reject(msg, false);
}

@Injectable()
export class EventMqConsumerService {
  constructor() { }

  @RabbitSubscribe({
    exchange: "sample_exchange",
    routingKey: "sample.routing_key.*",
    queue: "sample_queue",
    errorHandler
  })
  public async getSampleMessage(msg: string, amqpMsg: ConsumeMessage) {
    const routingKey = amqpMsg.fields.routingKey;
    console.log(`Received message at ${routingKey}: ${msg}`);
  }

  @RabbitRPC({
    exchange: "sample_exchange",
    routingKey: "sample.routing_key_rpc.*",
    queue: "sample_queue_rpc",
    errorHandler
  })
  public async getSampleRpcMessage(msg: string, amqpMsg: ConsumeMessage) {
    const routingKey = amqpMsg.fields.routingKey;
    console.log(`Received message at ${routingKey}: ${msg}`);
    return true;
  }
}