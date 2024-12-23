import { logger } from '@/common/framework';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './module';

// TODO: 添加一个自动连接comfy的接口

async function bootstrap(): Promise<void> {
  process.env.TZ = 'UTC';

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: process.env.NODE_ENV !== 'production',
      transform: true,
      exceptionFactory: (errors): BadRequestException => {
        const message = errors
          .map(
            (error) =>
              `${error.property} - ${Object.values(error.constraints!).join(', ')}`,
          )
          .join('\n');

        return new BadRequestException(message);
      },
    }),
  );

  app.setGlobalPrefix('api').enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('LR API 文档')
    .setDescription('LR 项目的 API 文档')
    .setVersion('1.0')
    .addTag('用户管理')
    .addTag('项目管理')
    .addTag('故事管理')
    .addTag('分镜管理')
    .addTag('提示词管理')
    .addTag('基础数据管理')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.SERVER_PORT!);

  logger.info(`Application is running on: ${await app.getUrl()}`, {
    context: 'Bootstrap',
  });
}

bootstrap();
