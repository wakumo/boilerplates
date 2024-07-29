import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { SampleService } from './sample.service.js';
import { SerializerInterceptor } from "../../commons/interceptors/serializer.interceptor.js";

@UseInterceptors(SerializerInterceptor, ClassSerializerInterceptor)
@Controller({ path: 'sample', version: 'v1' })
export class SampleController {
  constructor(private readonly sampleService: SampleService) { }

  @Get()
  getHello() {
    return { message: "hello" };
  }
}
