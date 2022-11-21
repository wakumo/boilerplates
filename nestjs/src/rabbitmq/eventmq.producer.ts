import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EventMqProducer {
  constructor(
    private readonly rabbitmq: AmqpConnection,
    private readonly config: ConfigService
  ) { }

  send(queueName: string, message: any): void {
    console.log(this.rabbitmq.configuration);
    this.rabbitmq.publish(this.config.get("rabbitmq.exchange.name"), queueName, message);
  }
}