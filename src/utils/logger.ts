import { ENVIRONMENT } from "@/constants/envs";

type LogLevel = "debug" | "info" | "warn" | "error";

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const LOG_LEVELS: Record<string, LogLevel[]> = {
  production: ["error"],
  sandbox: ["warn", "error"],
  local: ["debug", "info", "warn", "error"],
};

const allowedLevels = LOG_LEVELS[ENVIRONMENT] || LOG_LEVELS.local;

const shouldLog = (level: LogLevel): boolean => {
  return allowedLevels.includes(level);
};

export const logger: Logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog("debug")) {
      console.log("[DEBUG]", ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (shouldLog("info")) {
      console.info("[INFO]", ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (shouldLog("warn")) {
      console.warn("[WARN]", ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (shouldLog("error")) {
      console.error("[ERROR]", ...args);
    }
  },
};

export default logger;
