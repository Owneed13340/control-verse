
import * as crypto from 'crypto';
(global as any).crypto = crypto;


import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // ← Ajouté
import { IoAdapter } from '@nestjs/platform-socket.io'; // ← Ajouté

import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './common/configs/config.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // WebSocket adapter (Socket.io)
  app.useWebSocketAdapter(new IoAdapter(app));

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Shutdown hook
  app.enableShutdownHooks();

  // Prisma Client Exception Filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // CORS
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(3000, '0.0.0.0');

}
bootstrap();
