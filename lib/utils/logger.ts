const LOG_LEVELS = ['silent', 'error', 'warn', 'info', 'debug'] as const;

type LogLevel = (typeof LOG_LEVELS)[number];

const env = process.env.NODE_ENV || 'development';

const levelPriority: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

/* LOG_LEVEL fora da lista não tem prioridade: nenhuma comparação passa e
   nada é logado. */
function readConfiguredPriority() {
  const fromEnv = process.env.LOG_LEVEL;

  if (!fromEnv) return levelPriority[env === 'production' ? 'error' : 'info'];

  const known = LOG_LEVELS.find((level) => level === fromEnv);

  return known === undefined ? Number.NaN : levelPriority[known];
}

const configuredPriority = readConfiguredPriority();

function shouldLog(level: LogLevel) {
  return levelPriority[level] <= configuredPriority;
}

function formatMessage(level: string, message: string) {
  const timestamp = new Date().toISOString();

  return `[${timestamp}] [${level}] ${message}`;
}

export const logger = {
  error: (message: string, ...optionalParams: unknown[]) => {
    if (shouldLog('error'))
      console.error(formatMessage('error', message), ...optionalParams);
  },
  warn: (message: string, ...optionalParams: unknown[]) => {
    if (shouldLog('warn'))
      console.warn(formatMessage('warn', message), ...optionalParams);
  },
  info: (message: string, ...optionalParams: unknown[]) => {
    if (shouldLog('info'))
      console.info(formatMessage('info', message), ...optionalParams);
  },
  debug: (message: string, ...optionalParams: unknown[]) => {
    if (shouldLog('debug'))
      console.debug(formatMessage('debug', message), ...optionalParams);
  }
};

export default logger;
