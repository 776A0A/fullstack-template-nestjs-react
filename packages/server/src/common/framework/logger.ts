import { pid } from 'process';
import { createLogger, format, transports, type LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';
import { day } from '../util';

const {
  NODE_ENV,
  LOG_LEVEL,
  LOG_DIR,
  LOG_ROTATION_DATE_PATTERN,
  LOG_ROTATION_MAX_FILES,
} = process.env;

const isProduction = NODE_ENV === 'production';

const customFormat = format.printf(
  ({ timestamp, level, stack, message, context }) => {
    return `(${pid}) ${timestamp} - [${level}] [${context}] - ${stack || message}`;
  },
);

const formatTime = (): string =>
  day().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss.SSS');

const basicFormat = format.combine(
  format.timestamp({ format: formatTime }),
  format.errors({ stack: true }),
);

const devLogger: LoggerOptions = {
  level: LOG_LEVEL,
  format: format.combine(
    format.colorize({ level: true }),
    basicFormat,
    customFormat,
  ),
  exitOnError: false,
  transports: [
    new transports.Console({ handleExceptions: true, handleRejections: true }),
  ],
};

// 日志轮转配置
const dailyRotateOptions = {
  datePattern: LOG_ROTATION_DATE_PATTERN,
  zippedArchive: false,
  maxFiles: LOG_ROTATION_MAX_FILES,
};

const prodLogger: LoggerOptions = {
  level: LOG_LEVEL,
  format: format.combine(basicFormat, format.json()),
  exitOnError: false,
  transports: [
    new transports.Console({ handleExceptions: true, handleRejections: true }),
    new transports.DailyRotateFile({
      level: 'info',
      filename: `${LOG_DIR}/%DATE%-access.log`,
      ...dailyRotateOptions,
    }),
    new transports.DailyRotateFile({
      level: 'error',
      filename: `${LOG_DIR}/%DATE%-error.log`,
      handleExceptions: true,
      handleRejections: true,
      ...dailyRotateOptions,
    }),
  ],
};

const logger = createLogger(isProduction ? prodLogger : devLogger);

export { logger };
