import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, transform: true, whitelist: true })
  );
  await app.listen(3000);
}
bootstrap();
