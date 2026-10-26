import { execFileSync, spawnSync } from 'node:child_process';

describe('test resource configuration', () => {
  const evaluate = (expression: string, env: Record<string, string> = {}) =>
    execFileSync(
      process.execPath,
      ['-e', `const config = require('./test-config.cjs'); ${expression}`],
      {
        env: { ...process.env, ...env },
        encoding: 'utf8',
      },
    ).trim();

  it('uses the same worker count and isolated database names', () => {
    expect(
      evaluate('console.log(config.testMaxWorkers)', { TEST_MAX_WORKERS: '2' }),
    ).toBe('2');
    expect(
      evaluate("console.log(config.testDatabaseName('starter_test', '2'))"),
    ).toBe('starter_test_2');
  });

  it('rejects invalid worker counts', () => {
    const result = spawnSync(
      process.execPath,
      ['-e', "require('./test-config.cjs')"],
      {
        env: { ...process.env, TEST_MAX_WORKERS: '2invalid' },
        encoding: 'utf8',
      },
    );
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('TEST_MAX_WORKERS');
  });
});

describe('database identifier quoting', () => {
  it('quotes embedded double quotes and rejects empty names', async () => {
    const { quoteDatabaseName } = await import('../pg-client.js');
    expect(quoteDatabaseName('a"b')).toBe('"a""b"');
    expect(() => quoteDatabaseName('')).toThrow();
  });
});

describe('container startup', () => {
  it('does not start the app after a failed migration', () => {
    const result = spawnSync(
      'sh',
      [
        '-c',
        'yarn() { return 23; }; set -- echo APP_STARTED; . ./entrypoint.sh',
      ],
      { encoding: 'utf8' },
    );
    expect(result.status).toBe(23);
    expect(result.stdout).not.toContain('APP_STARTED');
  });
});
