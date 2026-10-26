require('dotenv/config');

const testMaxWorkers = Number(process.env.TEST_MAX_WORKERS ?? 3);
if (!Number.isInteger(testMaxWorkers) || testMaxWorkers < 1) {
  throw new Error('TEST_MAX_WORKERS must be a positive integer');
}

function testDatabaseName(
  baseName,
  workerId = process.env.JEST_WORKER_ID ?? '1',
) {
  if (!baseName || !/^[1-9]\d*$/.test(workerId)) {
    throw new Error('DB_NAME_TEST and a positive worker ID are required');
  }
  return `${baseName}_${workerId}`;
}

module.exports = { testMaxWorkers, testDatabaseName };
