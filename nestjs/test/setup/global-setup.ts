import 'dotenv/config';

import { Logger } from '@nestjs/common';
import matchers from 'jest-extended';
import nock from 'nock';
expect.extend(matchers);

nock.disableNetConnect();
nock.enableNetConnect(/^(127\.0\.0\.1|localhost)(:\d+)?$/);

import '../mocks/mock-rabbitmq-spec.event-message.js';
import '../mocks/mock-eventmq.module.js';

if (process.env.SILENT_TEST === '1') {
  Logger.overrideLogger(false);
  jest.spyOn(console, 'log').mockImplementation(() => null);
  jest.spyOn(console, 'info').mockImplementation(() => null);
  jest.spyOn(console, 'error').mockImplementation(() => null);
  jest.spyOn(console, 'time').mockImplementation(() => null);
  jest.spyOn(console, 'timeEnd').mockImplementation(() => null);
}
