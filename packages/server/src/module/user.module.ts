import {
  UserEntity,
  UserRepositoryImpl,
} from '@/adapter/driven/persistence/user';
import { UserController } from '@/adapter/driving/restful/user';
import { UserService } from '@/application/user';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  providers: [
    UserService,
    { provide: 'UserRepository', useClass: UserRepositoryImpl },
  ],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule, JwtModule],
})
export class UserModule {}
