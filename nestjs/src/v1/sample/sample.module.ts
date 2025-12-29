import { Module } from '@nestjs/common';

import { SampleController } from './sample.controller.js';
import { SampleService } from './sample.service.js';

@Module({
  controllers: [SampleController],
  providers: [SampleService],
})
export class SampleModule {}
