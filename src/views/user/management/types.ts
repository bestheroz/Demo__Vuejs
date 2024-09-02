import type { DateTime, IdCreatedUpdated } from "@/definitions/types";

export interface User extends IdCreatedUpdated {
  loginId: string;
  name: string;
  useFlag: boolean;
  authorities: string[];
  joinedAt?: DateTime;
  latestActiveAt?: DateTime;
}

export interface UserCreate extends User {
  password?: string;
}

export function defaultUserCreate(): UserCreate {
  return {
    id: 0,
    loginId: "",
    name: "",
    useFlag: true,
    authorities: [],
  };
}
