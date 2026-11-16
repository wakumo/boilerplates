import { RedisService } from '@liaoliaots/nestjs-redis';
import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';

// Import after shared setup registers the ESM RabbitMQ mock.
const { AmqpConnection } = await import('@golevelup/nestjs-rabbitmq');
const { AppController } = await import('./app.controller.js');

describe('AppController', () => {
  let appController: InstanceType<typeof AppController>;
  let httpApp: INestApplication;
  const db = { pingCheck: jest.fn() };
  const redis = { ping: jest.fn() };
  const rabbitmq = { connected: true };

  beforeEach(async () => {
    db.pingCheck.mockReset().mockResolvedValue({ db: { status: 'up' } });
    redis.ping.mockReset().mockResolvedValue('PONG');
    rabbitmq.connected = true;
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: TypeOrmHealthIndicator, useValue: db },
        { provide: RedisService, useValue: { getOrThrow: () => redis } },
        { provide: AmqpConnection, useValue: rabbitmq },
      ],
      imports: [TerminusModule],
    }).compile();

    appController = app.get(AppController);
    httpApp = app.createNestApplication();
    httpApp.useLogger(false);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    await httpApp.init();
  });

  afterEach(async () => {
    jest.useRealTimers();
    await httpApp.close();
    jest.restoreAllMocks();
  });

  it('reports all dependencies healthy over HTTP', async () => {
    const response = await request(httpApp.getHttpServer())
      .get('/healthz')
      .expect(200);
    expect(response.body).toEqual({
      status: true,
      info: {
        db: { status: 'up' },
        redis: { status: 'up' },
        rabbitmq: { status: 'up' },
      },
      error: {},
      details: {
        db: { status: 'up' },
        redis: { status: 'up' },
        rabbitmq: { status: 'up' },
      },
    });
  });

  it.each(['db', 'redis', 'rabbitmq'])(
    'returns HTTP 503 when %s is down',
    async (dependency) => {
      if (dependency === 'db') {
        db.pingCheck.mockResolvedValue({ db: { status: 'down' } });
      } else if (dependency === 'redis') {
        redis.ping.mockRejectedValue(new Error('Connection refused'));
      } else {
        rabbitmq.connected = false;
      }
      const response = await request(httpApp.getHttpServer())
        .get('/healthz')
        .expect(503);
      expect(response.body.status).toBe(false);
      expect(response.body.details[dependency].status).toBe('down');
    },
  );

  it('rejects an unexpected Redis ping response', async () => {
    redis.ping.mockResolvedValue('unexpected');
    await request(httpApp.getHttpServer()).get('/healthz').expect(503);
  });

  it('times out a stalled Redis ping after one second', async () => {
    jest.useFakeTimers();
    redis.ping.mockReturnValue(new Promise(() => {}));
    const result = expect(appController.check()).rejects.toMatchObject({
      status: 503,
      response: { status: false, error: { redis: { status: 'down' } } },
    });
    await jest.advanceTimersByTimeAsync(1000);
    await result;
    expect(jest.getTimerCount()).toBe(0);
  });
});
