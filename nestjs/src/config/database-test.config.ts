import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { BaseEntity } from 'typeorm';

import * as entitiesIndex from '../../src/entities/index.js';
const entities = Object.values(entitiesIndex).filter(
  (entity: unknown): entity is typeof BaseEntity =>
    typeof entity === 'function' && entity.prototype instanceof BaseEntity,
);

@Injectable()
export class DatabaseTestConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('db.host'),
      port: this.configService.get('db.port'),
      username: this.configService.get('db.user_name'),
      database: this.configService.get('db.name_test'),
      password: this.configService.get('db.password'),
      entities: entities,
      synchronize: true,
    };
  }
}
