import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import { Article } from './article/entities/article.entity';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware, UserCheckMiddleware } from './auth/middleware';
import { Note } from './note/entities/note.entity';
import { NoteModule } from './note/note.module';
import { QuestionOption } from './question/entities/question-option.entity';
import { Question } from './question/entities/question.entity';
import { QuestionModule } from './question/question.module';
import { Study } from './study/entities/study.entity';
import { StudyModule } from './study/study.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'ai_questioning',
      entities: [User, Study, Article, Note, Question, QuestionOption],
      synchronize: true,
      timezone: 'Z',
    }),
    AuthModule,
    UserModule,
    StudyModule,
    ArticleModule,
    QuestionModule,
    NoteModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('study', 'user', 'article', 'note', 'question');

    consumer
      .apply(UserCheckMiddleware)
      .forRoutes('study', 'user', 'article', 'note', 'question');
  }
}
