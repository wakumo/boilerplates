import {
  Body,
  Controller,
  Get,
  type INestApplication,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { IsString } from 'class-validator';
import request from 'supertest';

import { createNestApplication } from './utils/utils.js';

class MessageDto {
  @IsString()
  message!: string;
}

class UnknownDto {}

@Controller()
class CompatibilityController {
  @Post('message')
  message(@Body() body: MessageDto) {
    return body;
  }

  @Post('unknown')
  unknown(@Body() body: UnknownDto) {
    return body;
  }

  @Get('files/*path')
  route(@Param('path') path: string[], @Query('filter') filter: string) {
    return { path, filter };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 8 } }))
  upload(@UploadedFile() file: { size: number }) {
    return { size: file.size };
  }
}

describe('HTTP dependency compatibility', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [CompatibilityController],
    }).compile();
    app = createNestApplication(module);
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('validates DTOs and strips non-whitelisted fields', async () => {
    await request(app.getHttpServer())
      .post('/message')
      .send({ message: 'hello', extra: 'removed' })
      .expect(201)
      .expect({ message: 'hello' });
    const response = await request(app.getHttpServer())
      .post('/message')
      .send({ message: 123 })
      .expect(400);
    expect(response.body).toMatchObject({
      statusCode: 400,
      message: ['message must be a string'],
    });
  });

  it('rejects DTOs without validation metadata', async () => {
    await request(app.getHttpServer())
      .post('/unknown')
      .send({ arbitrary: 'value' })
      .expect(400);
  });

  it('preserves wildcard routing and query decoding', async () => {
    await request(app.getHttpServer())
      .get('/files/a/b?filter=hello%20world')
      .expect(200)
      .expect({ path: ['a', 'b'], filter: 'hello world' });
  });

  it('accepts a small upload and enforces the configured limit', async () => {
    await request(app.getHttpServer())
      .post('/upload')
      .attach('file', Buffer.from('hello'), 'sample.txt')
      .expect(201)
      .expect({ size: 5 });
    await request(app.getHttpServer())
      .post('/upload')
      .attach('file', Buffer.alloc(9), 'large.txt')
      .expect(413);
  });

  it('rejects malformed JSON and oversized request bodies', async () => {
    await request(app.getHttpServer())
      .post('/message')
      .set('Content-Type', 'application/json')
      .send('{')
      .expect(400);
    await request(app.getHttpServer())
      .post('/message')
      .send({ message: 'a'.repeat(110 * 1024) })
      .expect(413);
  });
});
