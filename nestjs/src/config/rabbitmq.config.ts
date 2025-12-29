import {
  MessageHandlerErrorBehavior,
  RabbitMQConfig,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMqConfigService {
  constructor(private readonly configService: ConfigService) {}

  create(): RabbitMQConfig {
    const host = this.configService.get<string>('rabbitmq.host')!;
    const port = this.configService.get<string>('rabbitmq.port')!;
    const user = this.configService.get<string>('rabbitmq.user')!;
    const pass = this.configService.get<string>('rabbitmq.pass')!;
    return {
      exchanges: [
        {
          name: this.configService.get('rabbitmq.exchange.name')!,
          type: 'topic',
          options: {
            durable: true,
          },
        },
        {
          name: this.configService.get('rabbitmq.exchange.dlx')!,
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
