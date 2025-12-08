/**
 * Storage Keys 관리
 * - 모든 localStorage 키를 중앙 집중화하여 관리
 * - 타입 안전성 보장
 */
export const STORAGE_KEYS = {
  accessToken: "demo-accessToken",
  refreshToken: "demo-refreshToken",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Token Storage 유틸리티
 * - JWT 토큰 저장/조회/삭제를 위한 추상화 계층
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    return window.localStorage.getItem(STORAGE_KEYS.accessToken);
  },

  getRefreshToken(): string | null {
    return window.localStorage.getItem(STORAGE_KEYS.refreshToken);
  },

  setAccessToken(token: string): void {
    window.localStorage.setItem(STORAGE_KEYS.accessToken, token);
  },

  setRefreshToken(token: string): void {
    window.localStorage.setItem(STORAGE_KEYS.refreshToken, token);
  },

  removeAccessToken(): void {
    window.localStorage.removeItem(STORAGE_KEYS.accessToken);
  },

  removeRefreshToken(): void {
    window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
  },

  clearTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  },

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },
} as const;
