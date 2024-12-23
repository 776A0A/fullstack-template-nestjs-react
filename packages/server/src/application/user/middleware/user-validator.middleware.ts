import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserValidatorMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.userId) {
      next();
      return;
    }

    try {
      await this.userService.getUser(req.userId);
      next();
    } catch {
      throw new UnauthorizedException({
        code: HttpStatus.UNAUTHORIZED,
        message: '用户不存在或已失效',
      });
    }
  }
}
