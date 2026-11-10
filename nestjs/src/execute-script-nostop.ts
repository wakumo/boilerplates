import { CommandFactory } from 'nest-commander';

import { JobModule } from './job.module.js';

const bootstrap = async () => {
  await CommandFactory.runWithoutClosing(JobModule, [
    'log',
    'warn',
    'error',
    'verbose',
  ]);
};

void bootstrap();
