import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from '../user.service';

@Injectable()
export class UserCheckMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new UnauthorizedException({
        code: HttpStatus.UNAUTHORIZED,
        message: '用户未登录',
      });
    }

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException({
        code: HttpStatus.NOT_FOUND,
        message: '用户不存在',
      });
    }

    next();
  }
}
