import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import {
  HealthCheck,
  type HealthCheckResult,
  HealthCheckService,
  HealthIndicatorService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { defer, firstValueFrom, timeout } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly healthIndicator: HealthIndicatorService,
    private readonly redisService: RedisService,
    private readonly rabbitmq: AmqpConnection,
  ) {}

  private async redisHealthCheck() {
    const indicator = this.healthIndicator.check('redis');
    try {
      const pong = await firstValueFrom(
        defer(() => this.redisService.getOrThrow().ping()).pipe(timeout(1000)),
      );
      return pong === 'PONG' ? indicator.up() : indicator.down();
    } catch {
      return indicator.down();
    }
  }

  private rabbitmqHealthCheck() {
    const indicator = this.healthIndicator.check('rabbitmq');
    return this.rabbitmq.connected ? indicator.up() : indicator.down();
  }

  @Get('/healthz')
  @HealthCheck()
  async check() {
    try {
      const result = await this.healthCheckService.check([
        () => this.typeOrmHealthIndicator.pingCheck('db', { timeout: 1000 }),
        () => this.redisHealthCheck(),
        () => this.rabbitmqHealthCheck(),
      ]);
      return { ...result, status: true };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        const result = error.getResponse() as HealthCheckResult;
        throw new ServiceUnavailableException({ ...result, status: false });
      }
      throw error;
    }
  }
}
