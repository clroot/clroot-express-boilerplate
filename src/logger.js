import fs from 'fs';
import path from 'path';
import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';

const logDir = path.resolve(path.join(__dirname, '/../logs'));
const [infoLogDir, errorLogDir, debugLogDir] = ['info', 'error', 'debug'].map(iter => path.join(logDir, iter));

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
  fs.mkdirSync(infoLogDir);
  fs.mkdirSync(errorLogDir);
  fs.mkdirSync(debugLogDir);
}

const consoleTransport = new transports.Console({
  level: 'info',
});

const infoTransport = new transports.DailyRotateFile({
  level: 'info',
  filename: 'info-%DATE%.log',
  dirname: infoLogDir,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const errorTransport = new transports.DailyRotateFile({
  level: 'error',
  filename: 'error-%DATE%.log',
  dirname: errorLogDir,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const debugTransport = new transports.DailyRotateFile({
  level: 'debug',
  filename: 'debug-%DATE%.log',
  dirname: debugLogDir,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '1d',
});

const logFormat = format.printf(({ level, message, timestamp }) =>
  `${timestamp} ${level}: ${message}`.trim().replaceAll('', ''),
);


const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    logFormat,
  ),
  transports: [consoleTransport, infoTransport, errorTransport, debugTransport],
});

export const stream = {
  write: message => {
    logger.info(message);
  },
};

export default logger;