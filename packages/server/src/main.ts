import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { logger } from './common';
import { AppModule } from './module';

// TODO: 用户只能修改自己的数据
// TODO: logging
// TODO: 优化dto

async function bootstrap() {
  process.env.TZ = 'UTC';

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });

  app.setGlobalPrefix('api').enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('yourprojectname')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.SERVER_PORT!);

  logger.info(`Application is running on: ${await app.getUrl()}`, {
    context: 'Bootstrap',
  });
}

bootstrap();
