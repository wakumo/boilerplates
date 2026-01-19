import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';

import { ResponseSerializerInterceptor } from '../../commons/interceptors/response-serializer.interceptor.js';
import { SampleService } from './sample.service.js';

@UseInterceptors(ResponseSerializerInterceptor, ClassSerializerInterceptor)
@Controller({ path: 'sample', version: 'v1' })
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Get()
  getHello() {
    return { message: 'hello' };
  }
}
