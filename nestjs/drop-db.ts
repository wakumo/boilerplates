import { client, dbName, dbNameTest, quoteDatabaseName } from './pg-client.js';

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
    await client.query(`DROP DATABASE IF EXISTS ${quoteDatabaseName(name)}`);
    console.info(`DROPPED DB ${name}`);
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await client.end();
}
