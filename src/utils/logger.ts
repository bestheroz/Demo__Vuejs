import { createConsola } from "consola";
import { ENVIRONMENT } from "@/constants/envs";

const consola = createConsola({
  level: ENVIRONMENT === "prod" ? 3 : 5,
});

// consola의 LogFn 타입과 호환되는 로거 메서드 타입
type LogMethod = (message: unknown, ...args: unknown[]) => void;

interface Logger {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

// consola 메서드를 직접 바인딩하여 타입 안정성 확보
export const logger: Logger = {
  debug: consola.log.bind(consola),
  info: consola.info.bind(consola),
  warn: consola.warn.bind(consola),
  error: consola.error.bind(consola),
};
