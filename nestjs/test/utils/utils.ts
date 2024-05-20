import { ConfigModule } from "@nestjs/config";
import { BaseEntity, DataSource, DataSourceOptions } from 'typeorm';
import { configuration } from "../../src/config/config.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { DatabaseTestConfigService } from "../../src/config/database-test.config.js";

import * as entitiesIndex from '../../src/entities/index.js';
const entities = Object.values(entitiesIndex).filter((entity: any) => BaseEntity.isPrototypeOf(entity));

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
    entities: entities as any,
    synchronize: true,
  } as DataSourceOptions);
  await dataSource
    .initialize()
    .then(async (_) => await dataSource.synchronize(true));
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
  const app =  module.createNestApplication();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: false,
  });
  app.useGlobalPipes(new ValidationPipe());

  return app;
}