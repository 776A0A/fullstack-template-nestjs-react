import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw new UnauthorizedException({
        code: HttpStatus.UNAUTHORIZED,
        message: '请先登录',
      });
    }

    if (!bearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        code: HttpStatus.UNAUTHORIZED,
        message: '无效的令牌',
      });
    }

    const token = bearerToken.substring(7, bearerToken.length);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      req.userId = payload.userId;
    } catch {
      throw new UnauthorizedException({
        code: HttpStatus.UNAUTHORIZED,
        message: '登陆超时',
      });
    }

    next();
  }
}
