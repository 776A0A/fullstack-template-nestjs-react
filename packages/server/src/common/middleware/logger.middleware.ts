import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import size from 'lodash.size';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, ip } = req;

    this.logger.log(
      `Request: ${method} ${originalUrl} ${ip}`,
      LoggerMiddleware.name,
    );

    if (size(body)) {
      if (body.password) body.password = '******';
      this.logger.log(
        `Request body: ${JSON.stringify(body)}`,
        LoggerMiddleware.name,
      );
    }
    if (size(query)) {
      this.logger.log(
        `Request query: ${JSON.stringify(query)}`,
        LoggerMiddleware.name,
      );
    }

    req.once('close', () => {
      const { statusCode } = res;
      this.logger.log(`Response: ${statusCode}`, LoggerMiddleware.name);
    });

    next();
  }
}
