import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import type { LoggerOptions } from 'typeorm';
import { BaseEntity } from 'typeorm';

import * as entitiesIndex from '../../src/entities/index.js';
import { DatabaseConfig } from './config.js';

const entities = Object.values(entitiesIndex).filter(
  (entity: unknown): entity is typeof BaseEntity =>
    typeof entity === 'function' && entity.prototype instanceof BaseEntity,
);

@Injectable()
export class DatabaseTestConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(DatabaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof DatabaseConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      host: this.dbConfig.host,
      port: this.dbConfig.port,
      username: this.dbConfig.userName,
      database: this.dbConfig.nameTest,
      password: this.dbConfig.password,
      // due to typeorm issue, it is advisable to use imported entities for testing instead of path joining
      // ref: https://github.com/typeorm/typeorm/issues/11095
      entities: entities as (typeof BaseEntity)[],
      logging: this.dbConfig.loggerOptions as LoggerOptions,
      maxQueryExecutionTime: this.dbConfig.slowLimit,
      synchronize: true,
    };
  }
}
