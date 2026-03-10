import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwt from 'jsonwebtoken';
import { BaseEntity, DataSource, DataSourceOptions } from 'typeorm';

import { sleep } from '../../src/commons/utils/async.helper.js';
import { configurations } from '../../src/config/config.js';
import {
  MILLISECONDS_TO_SECONDS,
  TOKEN_EXPIRE_TIME,
} from '../../src/config/constants.js';
import { DatabaseTestConfigService } from '../../src/config/database-test.config.js';
import * as entitiesIndex from '../../src/entities/index.js';
const entities = Object.values(entitiesIndex).filter(
  (entity: unknown): entity is typeof BaseEntity =>
    typeof entity === 'function' && entity.prototype instanceof BaseEntity,
);

export const IMPORT_MODULES = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: configurations,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useClass: DatabaseTestConfigService,
  }),
];

export function anything<T = unknown>() {
  return expect.anything() as T;
}

export async function getSynchronizeConnection() {
  const dataSource = new DataSource({
    name: 'default',
    type: 'postgres' as const,
    database: process.env.DB_NAME_TEST,
    entities: entities as (typeof BaseEntity)[],
    synchronize: true,
  } as DataSourceOptions);
  await dataSource
    .initialize()
    .then(async (_) => await dataSource.synchronize(true));
  return dataSource;
}

export async function cleanupDB(dataSource: DataSource, retries = 0) {
  try {
    const allEntities = dataSource.entityMetadatas;
    const tablesToTruncate = allEntities.map((entity) => entity.tableName);
    if (tablesToTruncate.length === 0) {
      return;
    }

    await dataSource.query(
      `TRUNCATE ${tablesToTruncate.join(', ')} RESTART IDENTITY CASCADE`,
    );
  } catch (ex) {
    console.debug(ex);
    if (retries < 5) {
      await sleep(3000);
      await cleanupDB(dataSource, retries + 1);
    } else {
      throw ex;
    }
  }
}

export async function cleanupEntities(
  dataSource: DataSource,
  entitiesToCleanup: BaseEntity[],
  retries = 0,
) {
  try {
    const allEntities = dataSource.entityMetadatas;
    const includedEntities = entitiesToCleanup
      ? entitiesToCleanup.map((includeEntity) => includeEntity.constructor.name)
      : [];
    const tableToTruncate = allEntities
      .filter((entity) => includedEntities.includes(entity.name))
      .map((entity) => entity.tableName);
    if (tableToTruncate.length === 0) {
      return;
    }

    await dataSource.query(
      `TRUNCATE ${tableToTruncate.join(', ')} RESTART IDENTITY CASCADE;`,
    );
  } catch (ex) {
    console.debug(ex);
    if ('deadlock' in ex) {
      console.log('[deadlock]');
    }
    if (retries < 5) {
      await sleep(2000);
      await cleanupEntities(dataSource, entitiesToCleanup, retries + 1);
    } else {
      throw ex;
    }
  }
}

export function createNestApplication(module: TestingModule): INestApplication {
  const app = module.createNestApplication();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: false,
  });
  app.useGlobalPipes(new ValidationPipe());

  return app;
}

// generate jwt token for testing
//   support custom exp time in case we need to test token expiration
export function generateJwtToken(walletAddress: string, exp?: number): string {
  const expireTime =
    exp ??
    Math.floor(new Date().getTime() * MILLISECONDS_TO_SECONDS) +
      TOKEN_EXPIRE_TIME;

  return jwt.sign(
    {
      wallet_address: walletAddress.toLowerCase(),
      service_name: 'boilerplate',
      iss: 'boilerplate-issuer',
      exp: expireTime,
      iat: expireTime - TOKEN_EXPIRE_TIME,
    },
    process.env.JWT_SECRET!,
  );
}
