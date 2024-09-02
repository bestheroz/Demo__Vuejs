import type { MenuTypeString, UserTypeString } from "@/definitions/selections";
import type { AuthorityString } from "@/definitions/authorities";

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
  authority?: AuthorityString;
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
  accessToken: string;
  refreshToken: string;
}

export interface TokenClaims {
  id: number; // ID(KEY)
  loginId: string; // 로그인 아이디
  name: string; // 이름
  type: UserTypeString; // 권한 유형
  managerFlag: boolean; // 매니저 여부(모든 권한 소유)
  authorities: string[]; // 권한 목록
}

export interface Id {
  id?: number;
}

export interface IdCreatedUpdated extends Id {
  createdBy?: UserSimple;
  createdAt?: DateTime;
  updatedBy?: UserSimple;
  updatedAt?: DateTime;
}

export interface UserSimple extends Id {
  loginId: string; // 로그인 아이디
  name: string; // 이름
  type: UserTypeString; // 권한 유형
}

export interface ListApiResult<T> {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
}
