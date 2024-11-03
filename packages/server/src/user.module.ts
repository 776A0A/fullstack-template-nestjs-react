import { UserController } from '@/adapter/driving/restful/user';
import { UserService } from '@/application/user';
import { UserEntity } from '@/domain/user';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule, JwtModule],
})
export class UserModule {}
