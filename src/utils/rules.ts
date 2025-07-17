import dayjs from "dayjs";
import type { DateTime } from "@/definitions/types";
import { isValidDateFormat } from "@/utils/formatter";

export function isEmpty(val?: unknown | unknown[] | null) {
  if (Array.isArray(val)) {
    return val.length === 0;
  }
  return val === undefined || val === null || val === "";
}

export function isValidValue(value: unknown) {
  return value !== undefined && value !== null;
}

export function required(val: unknown | unknown[]): string | boolean {
  if (!isEmpty(val as string)) {
    return true;
  }
  return "입력 필수입니다.";
}

export const minLength =
  (min: number) =>
  (val: string | unknown[]): string | boolean => {
    if (isEmpty(val)) {
      return true;
    }
    if (Array.isArray(val)) {
      return min <= val.length || `${min}개(자리) 이상 등록 하세요!`;
    }
    return min <= val.length || `${min}개(자리) 이상 등록 하세요!`;
  };
export const maxLength =
  (max: number) =>
  (val: string): string | boolean => {
    if (isEmpty(val as string)) {
      return true;
    }
    if (Array.isArray(val)) {
      return val.length <= max || `${max}개(자리) 이하로 등록 가능합니다!`;
    }
    return val.length <= max || `${max}개(자리) 이하로 등록 가능합니다!`;
  };

export function isEmail(val: string): boolean | string {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return (
    isEmpty(val) || emailPattern.test(val) || "올바르지 않은 이메일 형식입니다!"
  );
}

export function isAlphanumeric(val: string): boolean | string {
  return (
    isEmpty(val) ||
    /^[a-zA-Z0-9]+$/.test(val) ||
    "영문, 숫자만 입력 가능합니다!"
  );
}
export function isDigits(val: string): boolean | string {
  return isEmpty(val) || /^[0-9]+$/.test(val) || "숫자만 입력 가능합니다!";
}
export function isNumeric(val: string): boolean | string {
  return (
    isEmpty(val) ||
    /^-?(\d+\.?\d*|\.\d+)$/.test(val) ||
    "숫자와 음수부호(-), 소수점(.) 입력만 가능합니다!"
  );
}

export const minDateValue =
  (minValue: DateTime) =>
  (val: string): string | boolean => {
    return (
      isEmpty(val) ||
      !isValidDateFormat(val) ||
      dayjs(val, "YYYY-MM-DD").isAfter(dayjs(minValue)) ||
      "날짜의 최소값이 잘못되었습니다!"
    );
  };
