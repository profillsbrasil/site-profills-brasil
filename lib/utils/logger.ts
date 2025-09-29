type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug';

const env = process.env.NODE_ENV || 'development';
const configuredLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (env === 'production' ? 'error' : 'info');

const levelPriority: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

function shouldLog(level: LogLevel) {
  return levelPriority[level] <= levelPriority[configuredLevel];
}

function formatMessage(level: string, message: unknown) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${String(message)}`;
}

export const logger = {
  error: (message?: unknown, ...optionalParams: unknown[]) => {
    if (shouldLog('error'))
      console.error(formatMessage('error', message), ...optionalParams);
  },
  warn: (message?: unknown, ...optionalParams: unknown[]) => {
    if (shouldLog('warn'))
      console.warn(formatMessage('warn', message), ...optionalParams);
  },
  info: (message?: unknown, ...optionalParams: unknown[]) => {
    if (shouldLog('info'))
      console.info(formatMessage('info', message), ...optionalParams);
  },
  debug: (message?: unknown, ...optionalParams: unknown[]) => {
    if (shouldLog('debug'))
      console.debug(formatMessage('debug', message), ...optionalParams);
  }
};

export default logger;
