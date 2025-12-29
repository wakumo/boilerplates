import { Command, CommandRunner, Option } from 'nest-commander';

interface UserJobOptions {
  name: string;
}

@Command({ name: 'job:sample', description: 'Sample job' })
export class SampleJob extends CommandRunner {
  constructor() {
    super();
  }

  run(_passedParam: string[], options?: UserJobOptions): Promise<void> {
    console.log(
      `Hello, ${options?.name || 'World'}, this is ${
        process.env.USER_NAME || 'Unknown'
      }`,
    );
    return Promise.resolve();
  }

  @Option({
    flags: '-n, --name [string]',
    description: 'Your name',
  })
  parseString(val: string): string {
    return val;
  }
}
