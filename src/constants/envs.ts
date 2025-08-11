function getRequiredEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const PRODUCT_TITLE = getRequiredEnv("VITE_PRODUCT_TITLE");
export const PRODUCT_VERSION = getRequiredEnv("VITE_PRODUCT_VERSION");
export const API_HOST = getRequiredEnv("VITE_BASE_API_URL");
export const DATE_FORMAT_STRING = getRequiredEnv("VITE_DATE_FORMAT_STRING");
export const DATETIME_SECONDS_FORMAT_STRING = getRequiredEnv(
  "VITE_DATETIME_SECONDS_FORMAT_STRING",
);
export const TIME_SECONDS_FORMAT_STRING = getRequiredEnv(
  "VITE_TIME_SECONDS_FORMAT_STRING",
);
export const DATETIME_FORMAT_STRING = getRequiredEnv(
  "VITE_DATETIME_FORMAT_STRING",
);
export const TIME_FORMAT_STRING = getRequiredEnv("VITE_TIME_FORMAT_STRING");
export const ENVIRONMENT = getRequiredEnv("VITE_ENVIRONMENT");
