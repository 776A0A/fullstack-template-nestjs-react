import { pid } from 'process';
import { createLogger, format, transports, type LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';
import { day } from './utils';

const customFormat = format.printf(
  ({ timestamp, level, stack, message, context }) => {
    return `(${pid}) ${timestamp} - [${level}] [${context}] - ${stack || message}`;
  },
);

const formatTime = () =>
  day().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss.SSS');

const basicFormat = format.combine(
  format.timestamp({ format: formatTime }),
  format.errors({ stack: true }),
);

const devLogger: LoggerOptions = {
  format: format.combine(
    format.colorize({ level: true }),
    basicFormat,
    customFormat,
  ),
  exitOnError: false,
  transports: [
    new transports.Console({
      level: 'silly',
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
};

const dailyRotateOptions = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '15d',
};

const prodLogger: LoggerOptions = {
  format: format.combine(basicFormat, format.json()),
  exitOnError: false,
  transports: [
    new transports.DailyRotateFile({
      level: 'info',
      filename: 'logs/%DATE%-access.log',
      ...dailyRotateOptions,
    }),
    new transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/%DATE%-error.log',
      handleExceptions: true,
      handleRejections: true,
      ...dailyRotateOptions,
    }),
  ],
};

const logger = createLogger(
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger,
);

export { logger };
