import { createConsola } from "consola";
import { ENVIRONMENT } from "@/constants/envs";

const LOG_LEVELS = {
  prod: 2, // fatal, error, warn
  staging: 3, // + log, info
  local: 5, // + debug, trace
} as const;

const consola = createConsola({
  level: LOG_LEVELS[ENVIRONMENT as keyof typeof LOG_LEVELS] ?? 5,
});

type LogMethod = (message: unknown, ...args: unknown[]) => void;

interface Logger {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

export const logger: Logger = {
  debug: consola.log.bind(consola),
  info: consola.info.bind(consola),
  warn: consola.warn.bind(consola),
  error: consola.error.bind(consola),
};
