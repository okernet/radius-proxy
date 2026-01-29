import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { EnvService } from './env/env.service';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { bufferLogs: true });

  const envService = app.get(EnvService);

  // Logger
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();

  // Validate incoming requests
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Enable class-transformer serialization
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('RADIUS Proxy API')
    .setDescription('Local RADIUS proxy for offline authentication')
    .addApiKey({ type: 'apiKey', name: 'X-Api-Key', in: 'header' }, 'X-Api-Key')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  // Start the application
  const port = envService.get('PORT');
  const host = envService.get('HOST');
  await app.listen(port, host);
  logger.log(`RADIUS Proxy is running on: ${await app.getUrl()}`, 'NestApplication');
}

bootstrap();
