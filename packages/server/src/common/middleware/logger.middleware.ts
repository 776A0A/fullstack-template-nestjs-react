import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import size from 'lodash.size';
import pc from 'picocolors';
import { generateRequestId } from '../util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = generateRequestId();
    req.requestId = requestId;

    const { method, originalUrl, body, query, ip } = req;
    const requestPrefix = `Request [${pc.cyan(`${requestId}`)}]:`;

    this.logger.log(
      `${requestPrefix} ${method} ${originalUrl} ${ip}`,
      LoggerMiddleware.name,
    );

    if (size(body)) {
      const hasPassword = !!body.password;
      this.logger.log(
        `${requestPrefix} Body - ${JSON.stringify({ ...body, ...(hasPassword ? { password: '*****' } : {}) })}`,
        LoggerMiddleware.name,
      );
    }
    if (size(query)) {
      this.logger.log(
        `${requestPrefix} Query - ${JSON.stringify(query)}`,
        LoggerMiddleware.name,
      );
    }

    res.setHeader('X-Request-ID', requestId);
    res.once('close', () => {
      this.logger.log(
        `Response [${pc.cyan(`${requestId}`)}]: Finished with ${res.statusCode >= 400 ? pc.red(res.statusCode) : pc.green(res.statusCode)}`,
        LoggerMiddleware.name,
      );
    });

    next();
  }
}
