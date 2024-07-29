import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const environment = process.env.NODE_ENV;
const migrationsPath = environment === 'development' ? "src/migrations/*.ts" : "dist/src/migrations/*.js";

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [migrationsPath],
});