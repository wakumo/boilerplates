import 'dotenv/config';

import pg from 'pg';

const { Client } = pg;

export const dbName = process.env.DB_NAME;
export const dbNameTest = process.env.DB_NAME_TEST;

/** Quote a PostgreSQL identifier; database names cannot be query parameters. */
export function quoteDatabaseName(name: string | undefined): string {
  if (!name || name.includes('\0') || Buffer.byteLength(name) > 63) {
    throw new Error('Database name must contain 1–63 bytes and no null bytes');
  }
  return `"${name.replaceAll('"', '""')}"`;
}

export const connectionOptions = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5432,
  password: process.env.DB_PASSWORD || '',
};

export const client = new Client({
  ...connectionOptions,
  database: 'postgres',
});
