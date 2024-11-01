import { UserService } from '@/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserCheckMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.userId;
    if (!userId) return this.invalidUser(res);

    const user = await this.userService.findOne(userId);
    if (!user) return this.invalidUser(res);

    next();
  }

  private invalidUser(res: Response<any, Record<string, any>>) {
    res.status(401).json({ message: '用户未登录' });
    return;
  }
}
