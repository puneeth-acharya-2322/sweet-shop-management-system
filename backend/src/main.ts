// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- 1. Import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. Add this line
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically strip non-whitelisted properties
    transform: true, // Automatically transform payloads to DTO instances (like string to number)
  }));

  await app.listen(3000);
}
bootstrap();