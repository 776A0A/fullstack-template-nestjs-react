import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import size from 'lodash.size';
import pc from 'picocolors';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, ip } = req;

    const requestPrefix = pc.cyan(`Request`);

    this.logger.log(
      `${requestPrefix}: ${method} ${originalUrl} ${ip}`,
      LoggerMiddleware.name,
    );

    if (size(body)) {
      const hasPassword = !!body.password;
      this.logger.log(
        `${requestPrefix} body: ${JSON.stringify({ ...body, ...(hasPassword ? { password: '*****' } : {}) })}`,
        LoggerMiddleware.name,
      );
    }
    if (size(query)) {
      this.logger.log(
        `${requestPrefix} query: ${JSON.stringify(query)}`,
        LoggerMiddleware.name,
      );
    }

    res.once('close', () => {
      this.logger.log(
        `${pc.blue(`Response`)}: ${res.statusCode}`,
        LoggerMiddleware.name,
      );
    });

    next();
  }
}
