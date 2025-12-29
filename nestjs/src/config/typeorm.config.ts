import 'dotenv/config';
import { DataSource } from 'typeorm';

const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  logging: true,
  entities: isDevelopment
    ? ['src/entities/**/*.entity.ts']
    : ['dist/src/entities/**/*.entity.js'],
  migrations: isDevelopment
    ? ['src/migrations/*.ts']
    : ['dist/src/migrations/*.js'],
});