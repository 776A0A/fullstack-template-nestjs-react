import { EntityUnreachableError } from '@/common/error';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import pc from 'picocolors';
import { HttpResponse } from '../util/http-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof EntityUnreachableError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string })?.message || '请求错误';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        exception instanceof Error ? exception.message : '内部服务器错误';
    }

    this.logger.error(
      ``,
      `Request: [${pc.cyan(request.requestId)}]
      ${request.method} ${request.url} ${pc.red(status)}
      ${pc.red('Error message: ' + message)}
      ${exception instanceof Error ? exception.stack : JSON.stringify(exception)}`,
      'AllExceptionsFilter',
    );

    response.status(status).json(HttpResponse.error(message, status));
  }
}
