import type { IdCreatedUpdated } from "@/definitions/types";

export interface Notice extends IdCreatedUpdated {
  title: string;
  content: string;
  useFlag: boolean;
}

export function defaultNotice(): Notice {
  return {
    title: "",
    content: "",
    useFlag: true,
  };
}
