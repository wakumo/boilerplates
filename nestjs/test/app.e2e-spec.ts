import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { BullConfigService } from '../src/config/bull.config.js';
import { BullTestConfigService } from '../src/config/bull-test.config.js';
import { DatabaseConfigService } from '../src/config/database.config.js';
import { DatabaseTestConfigService } from '../src/config/database-test.config.js';
import { RedisConfigService } from '../src/config/redis.config.js';
import { RedisTestConfigService } from '../src/config/redis-test.config.js';
import { createNestApplication } from './utils/utils.js';

// Import after setupFilesAfterEnv has registered the ESM RabbitMQ mocks.
const { AppModule } = await import('../src/app.module.js');

describe('Application HTTP integration', () => {
  let app: INestApplication | undefined;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(DatabaseConfigService)
      .useClass(DatabaseTestConfigService)
      .overrideProvider(RedisConfigService)
      .useClass(RedisTestConfigService)
      .overrideProvider(BullConfigService)
      .useClass(BullTestConfigService)
      .compile();
    app = createNestApplication(module);
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('serves the starter endpoint', async () => {
    await request(app!.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('checks the test database', async () => {
    await request(app!.getHttpServer())
      .get('/healthz')
      .expect(200)
      .expect({ status: true });
  });
});
