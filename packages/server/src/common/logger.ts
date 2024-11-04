import { pid } from 'process';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { day } from './utils';

const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  return `(${pid}) ${timestamp} - [${level}] - ${stack || message}`;
});

const formatTime = () => day().format('YYYY-MM-DD HH:mm:ss.SSS');

const devLogger = {
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: formatTime }),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [new transports.Console({ level: 'silly' })],
};

const dailyRotateOptions = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '15d',
};

const prodLogger = {
  format: format.combine(
    format.timestamp({ format: formatTime }),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.DailyRotateFile({
      level: 'info',
      filename: 'logs/%DATE%-access.log',
      ...dailyRotateOptions,
    }),
    new transports.DailyRotateFile({
      level: 'error',
      filename: 'logs/%DATE%-error.log',
      ...dailyRotateOptions,
    }),
  ],
};

const logger = createLogger(
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger,
);

export { logger };
