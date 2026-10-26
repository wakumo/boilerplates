import 'dotenv/config';

import fs from 'fs';
import { DataSource } from 'typeorm';

const isEntitiesBuilt = fs.existsSync('./dist/src/entities');
const isMigrationsBuilt = fs.existsSync('./dist/src/migrations');

const useBuiltFiles = import.meta.url.endsWith('.js');
const entitiesPath =
  useBuiltFiles || (isEntitiesBuilt && process.env.NODE_ENV !== 'local')
    ? 'dist/src/entities/**/*.entity.js'
    : 'src/entities/**/*.entity.ts';

const migrationsPath =
  useBuiltFiles || (isMigrationsBuilt && process.env.NODE_ENV !== 'local')
    ? 'dist/src/migrations/*.js'
    : 'src/migrations/*.ts';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: true,
  entities: [entitiesPath],
  migrations: [migrationsPath],
});
