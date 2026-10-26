import pg from 'pg';

import {
  client,
  connectionOptions,
  dbName,
  dbNameTest,
  quoteDatabaseName,
} from './pg-client.js';

try {
  const testConfig =
    process.env.NODE_ENV === 'test'
      ? (await import('./test-config.cjs')).default
      : undefined;
  const names = testConfig
    ? Array.from({ length: testConfig.testMaxWorkers }, (_, index) =>
        testConfig.testDatabaseName(dbNameTest, String(index + 1)),
      )
    : [dbName];
  names.forEach(quoteDatabaseName);
  await client.connect();
  for (const name of names) {
    const existing = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [name],
    );
    if (!existing.rowCount) {
      await client.query(`CREATE DATABASE ${quoteDatabaseName(name)}`);
      console.info(`CREATED DB ${name}`);
    }
    const target = new pg.Client({ ...connectionOptions, database: name });
    try {
      await target.connect();
      await target.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    } finally {
      await target.end();
    }
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
