import {
  JwtMiddleware,
  UserCheckMiddleware,
} from '@/application/user/middleware';
import { LoggerMiddleware } from '@/common/middleware';
import { UserEntity } from '@/domain/user';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DATABASE_HOST,
      port: +DATABASE_PORT!,
      username: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      entities: [UserEntity],
      synchronize: true,
      timezone: 'Z',
    }),
    UserModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const routes: string[] = [];
    consumer
      .apply(JwtMiddleware, UserCheckMiddleware)
      .forRoutes(...routes)
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
