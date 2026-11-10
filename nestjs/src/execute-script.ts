import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';

import { JobModule } from './job.module.js';

const logger = new Logger('ExecuteScript');

const bootstrap = async () => {
  await CommandFactory.run(JobModule, ['log', 'warn', 'error', 'verbose']);
};

bootstrap()
  .then(() => {
    logger.verbose('Script executed successfully');
  })
  .catch((error) => {
    console.error(error);
  });
