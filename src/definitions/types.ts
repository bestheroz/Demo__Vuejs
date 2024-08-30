import type { MenuTypeString } from "@/definitions/selections";

export type DateTime = string | number | Date | null | undefined;

export interface SelectItem<T = string> {
  value: T;
  title: string;
}

export interface Drawer {
  name: string;
  type: MenuTypeString;
  icon?: string;
  url?: string;
  children?: Drawer[];
}

export interface ConfirmResolveResponse {
  uuid: string;
  value: boolean;
}

export interface Confirm {
  uuid: string;
  title: string;
  content: string;
  cancelButtonTitle: string;
  confirmButtonTitle: string;
  width?: string;
  resolver: (value: ConfirmResolveResponse) => void;
}

export interface JwtTokens {
  access: string;
  refresh: string;
}

export interface TokenClaims {
  id: number; // ID(KEY)
  loginId: string; // 로그인 아이디
  name: string; // 이름
  type: string; // 권한 유형
  managerFlag: boolean; // 매니저 여부(모든 권한 소유)
  authorities: string[]; // 권한 목록
}
