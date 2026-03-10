import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import type { Channel, ConsumeMessage } from 'amqplib';

import { RabbitmqConfig } from '../../config/config.js';

const rabbitConfig = RabbitmqConfig();

const ENV_NAME = process.env.ENV_NAME || '';

function errorHandler(channel: Channel, msg: ConsumeMessage, error: Error) {
  console.log(
    '------------------ AN ERROR HAS OCCURED WHILE TRYING TO HANDLE RABBITMQ MESSAGE',
  );
  console.log(error);
  channel.reject(msg, false);
}

@Injectable()
export class EventMqConsumer {
  constructor() {}

  @RabbitSubscribe({
    exchange: rabbitConfig.exchange.name,
    queue: `<service_name>-event-<func_name>-queue-${ENV_NAME}`,
    routingKey: `<project_name>.events.<service_name>.<func_name>`,
    queueOptions: {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': rabbitConfig.exchange.dlx,
        'x-dead-letter-routing-key':
          '<project_name>.deadletter.events.<service_name>.<func_name>',
      },
    },
    errorHandler: errorHandler,
  })
  public handleSocialEvent(_msg: unknown, _: ConsumeMessage) {
    console.log('SAMPLE CONSUMER');
    return;
  }
}
