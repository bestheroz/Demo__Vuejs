import dayjs, { extend } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  DATE_FORMAT_STRING,
  DATETIME_SECONDS_FORMAT_STRING,
  DATETIME_FORMAT_STRING,
} from "@/constants/envs";
import type { DateTime, SelectItem } from "@/definitions/types";
import { isEmpty, isNumeric, isValidValue } from "@/utils/rules";

extend(customParseFormat);

export function formatDatetimeSeconds(
  value?: DateTime,
  format = DATETIME_SECONDS_FORMAT_STRING,
): string {
  if (isEmpty(value)) return "-";
  return isValidDateFormat(value) ? dayjs(value).format(format) : "-";
}

export function formatDatetime(
  value?: DateTime,
  format = DATETIME_FORMAT_STRING,
): string {
  if (isEmpty(value)) return "-";
  return isValidDateFormat(value) ? dayjs(value).format(format) : "-";
}

export function formatDate(
  value?: DateTime,
  format = DATE_FORMAT_STRING,
): string {
  if (isEmpty(value)) return "-";
  return isValidDateFormat(value) ? dayjs(value).format(format) : "-";
}

export function isValidDateFormat(value: DateTime | undefined): boolean {
  return (
    !!value &&
    (value instanceof Date ||
      dayjs(value, DATETIME_SECONDS_FORMAT_STRING).isValid() ||
      dayjs(value, "YYYYMMDDHHmmss").isValid() ||
      dayjs(value, DATETIME_FORMAT_STRING).isValid() ||
      dayjs(value, "YYYYMMDDHHmm").isValid() ||
      dayjs(value, DATE_FORMAT_STRING).isValid() ||
      dayjs(value, "YYYYMMDD").isValid())
  );
}

export function formatTextOfSelectItem<T = string>(
  codes: SelectItem<T>[] | null,
  value: T,
  defaultLabel?: string,
): string {
  if (!isValidValue(value)) {
    return "-";
  }
  return (
    // 간혹 value 가 string|number 가 <T> 와 맞지 않는 케이스가 발생 == 비교로 처리
    (codes ?? []).find((item) => item.value == value)?.title ??
    defaultLabel ??
    (value ?? "-") + ""
  );
}
export function getValueOfSelectItem<T = string>(
  codes: SelectItem<T>[] | null,
  text?: string | null,
): T | null {
  if (!text) {
    return null;
  }
  return (
    ((codes ?? []).find((item) => item.title === text)?.value as T) ?? null
  );
}

export function getFilenameFromUrl(url?: string): string {
  if (!url) {
    return "";
  }

  const startIndex = url.lastIndexOf("/") + "/".length;
  const endIndex = url.indexOf("?", startIndex);

  if (startIndex === -1) {
    return url;
  }

  if (endIndex === -1) {
    return url.split("/").pop() ?? "";
  }

  return url.slice(startIndex, endIndex);
}

export function formatNumber(
  value: number | string | undefined,
  fractionDigits = 0,
  defaultValue = "-",
): string {
  if (isEmpty(value)) {
    return defaultValue;
  }
  if (!isNumeric(value + "")) {
    return defaultValue;
  }
  if (isNaN(+value!)) {
    return defaultValue;
  }
  return parseFloat(value + "").toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatFileSizeToKb(bytes?: number) {
  if (!bytes) {
    return 0 + " KB";
  }
  // 소수점 둘째자리까지만 표시
  return formatNumber(bytes / 1024) + " KB";
}
export function snakeToCamel(str?: string) {
  if (!str) {
    return "";
  }
  return str.toLowerCase().replace(/(_\w)/g, function (m) {
    return m[1].toUpperCase();
  });
}
export function getTitleByValue<T = string>(
  codes: SelectItem<T>[] | null,
  value: T,
  defaultLabel?: string,
): string {
  if (value === undefined) {
    return "-";
  }
  return (
    (codes ?? []).find((item) => item.value === value)?.title ||
    defaultLabel ||
    value + "" ||
    "-"
  );
}
