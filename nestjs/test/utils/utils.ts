import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity, DataSource, DataSourceOptions } from 'typeorm';

import { configuration } from '../../src/config/config.js';
import { DatabaseTestConfigService } from '../../src/config/database-test.config.js';
import * as entitiesIndex from '../../src/entities/index.js';
const entities = Object.values(entitiesIndex).filter(
  (entity: unknown): entity is typeof BaseEntity =>
    typeof entity === 'function' && entity.prototype instanceof BaseEntity,
);

export const IMPORT_MODULES = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useClass: DatabaseTestConfigService,
  }),
];

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
    .then(async () => await dataSource.synchronize(true));
  return dataSource;
}

export async function clearDB(dataSource: DataSource) {
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.query(
      `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`,
    );
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
