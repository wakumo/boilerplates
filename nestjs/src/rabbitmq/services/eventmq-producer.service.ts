import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Options } from 'amqplib';

import { RabbitmqConfig } from '../../config/config.js';
import { RABBIT_MQ_TIMEOUT_MS } from '../../config/constants.js';

@Injectable()
export class EventMqProducer {
  constructor(
    private readonly rabbitmq: AmqpConnection,
    @Inject(RabbitmqConfig.KEY)
    private readonly rabbitmqConfig: ConfigType<typeof RabbitmqConfig>,
  ) {}

  async publish(
    exchange: string,
    routingKey: string,
    payload: unknown,
    opts?: Options.Publish,
  ): Promise<void> {
    if (!exchange) exchange = this.rabbitmqConfig.exchange.name!;
    await this.rabbitmq.publish(exchange, routingKey, payload, opts);
  }

  request<T>(
    exchange: string,
    routingKey: string,
    payload: unknown,
    headers?: unknown,
  ): Promise<T> {
    if (!exchange) exchange = this.rabbitmqConfig.exchange.name!;
    return this.rabbitmq.request<T>({
      exchange,
      routingKey,
      payload,
      headers,
      timeout: RABBIT_MQ_TIMEOUT_MS,
    });
  }
}
