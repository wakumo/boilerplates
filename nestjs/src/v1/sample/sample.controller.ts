import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SerializerInterceptor } from '../../commons/interceptors/serializer.interceptor.js';
import { ExportSwapTxParams, UniswapV2Service } from '../../services/uniswap_v2_service.js';
import { SampleService } from './sample.service.js';
@UseInterceptors(SerializerInterceptor, ClassSerializerInterceptor)
@Controller({ path: 'sample', version: 'v1' })
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Get()
  getHello() {
    return { message: 'hello' };
  }


  @Post()
  async createSample(@Body() body: any) {
    const exportSwapTxParams: ExportSwapTxParams = body;
    try {
      const response = await UniswapV2Service.exportSwapTx(exportSwapTxParams);
      return response;
    } catch (error) {
      return { error: error.message };
    }
  }
}
