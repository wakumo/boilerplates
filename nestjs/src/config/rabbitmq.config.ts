import {
  MessageHandlerErrorBehavior,
  RabbitMQConfig,
} from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { RabbitmqConfig } from './config.js';

@Injectable()
export class RabbitMqConfigService {
  constructor(
    @Inject(RabbitmqConfig.KEY)
    private readonly rabbitmqConfig: ConfigType<typeof RabbitmqConfig>,
  ) {}

  create(): RabbitMQConfig {
    const { host, port, user, pass, exchange } = this.rabbitmqConfig;
    return {
      exchanges: [
        {
          name: exchange.name!,
          type: 'topic',
          options: {
            durable: true,
          },
        },
        {
          name: exchange.dlx,
          type: 'topic',
          options: {
            durable: true,
          },
        },
      ],
      // prefetchCount: 15,
      defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
      defaultRpcTimeout: 60000,
      uri: `amqp://${user}:${pass}@${host}:${port}`,
      connectionInitOptions: { wait: false },
      channels: {
        'default-channel': {
          prefetchCount: 20,
          default: true,
        },
        'channel-2': {
          prefetchCount: 1,
        },
      },
    };
  }
}
