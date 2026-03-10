import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import path from 'path';
import { LoggerOptions } from 'typeorm';
import { fileURLToPath } from 'url';

import { DatabaseConfig } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(DatabaseConfig.KEY)
    private readonly dbConfig: ConfigType<typeof DatabaseConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.dbConfig.host,
      port: this.dbConfig.port,
      username: this.dbConfig.userName,
      database: this.dbConfig.name,
      password: this.dbConfig.password,
      entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
      logging: this.dbConfig.loggerOptions as LoggerOptions,
      maxQueryExecutionTime: this.dbConfig.slowLimit,
    };
  }
}
