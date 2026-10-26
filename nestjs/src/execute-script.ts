import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';

import { JobModule } from './job.module.js';

const bootstrap = async () => {
  await CommandFactory.run(JobModule, {
    logger: ['warn', 'error', 'verbose'],
    serviceErrorHandler: (error) => {
      Logger.error(error, undefined, 'ExecuteScript');
      process.exitCode = 1;
    },
  });
};

bootstrap()
  .then(() => {
    Logger.log('Script executed successfully', 'ExecuteScript');
  })
  .catch((error) => {
    Logger.error(error, undefined, 'ExecuteScript');
    process.exitCode = 1;
  });
