import type { DateTime, IdCreatedUpdated } from "@/definitions/types";

export interface Admin extends IdCreatedUpdated {
  loginId: string;
  name: string;
  useFlag: boolean;
  managerFlag: boolean;
  authorities: string[];
  joinedAt?: DateTime; // readonly
  latestActiveAt?: DateTime; // readonly
}

export interface AdminCreate extends Admin {
  password?: string;
}

export function defaultAdminCreate(): AdminCreate {
  return {
    id: 0,
    loginId: "",
    name: "",
    useFlag: true,
    managerFlag: false,
    authorities: [],
  };
}
