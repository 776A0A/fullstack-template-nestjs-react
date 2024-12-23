import { TagEntity } from '@/adapter/driven/persistence/project';
import {
  ProjectEntity,
  ProjectTagEntity,
} from '@/adapter/driven/persistence/project/project';
import { UserEntity } from '@/adapter/driven/persistence/user';
import { JwtMiddleware, UserValidatorMiddleware } from '@/application/user';
import { AllExceptionsFilter } from '@/common/filter';
import { LoggerMiddleware } from '@/common/middleware';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project.module';
import { UserModule } from './user.module';

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DB_HOST,
      port: +DB_PORT!,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [UserEntity, ProjectEntity, ProjectTagEntity, TagEntity],
      synchronize: true,
      timezone: 'Z',
      logging: ['error'],
    }),
    UserModule,
    ProjectModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    const routes: string[] = ['v1/projects', 'v1/tags'];

    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(JwtMiddleware, UserValidatorMiddleware)
      .forRoutes(...routes);
  }
}
