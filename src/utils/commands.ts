import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { parse } from "qs";
import { API_HOST } from "@/constants/envs";
import { type JwtTokens } from "@/definitions/types";
import router from "@/router";
import { useAdminStore } from "@/stores/admin";
import { stringifyParams } from "@/utils/apis";

function formatPath(val: string): string {
  const _path = val.split("?");
  const uri = _path.splice(0, 1);
  return uri + stringifyParams(parse(_path.join("?")));
}

export async function routerPush(path: string): Promise<void> {
  if (formatPath(router.currentRoute.value.fullPath) === formatPath(path)) {
    return;
  }

  await router.push(path);
}

export async function routerReplace(path: string): Promise<void> {
  if (formatPath(router.currentRoute.value.fullPath) === formatPath(path)) {
    return;
  }

  await router.replace(path);
}

export function isExpiredToken(token: string): boolean {
  try {
    return dayjs((jwtDecode(token) as { exp: number }).exp * 1000).isBefore(
      dayjs(),
    );
  } catch (e: unknown) {
    console.warn(e);
    return true;
  }
}

export async function signOut(): Promise<void> {
  goLoginPage().then();
}

export async function goLoginPage(): Promise<void> {
  const { clearAdmin } = useAdminStore();
  clearAdmin();
  await routerReplace("/login");
}

export async function getNewToken(): Promise<JwtTokens | undefined> {
  try {
    return (
      await axios
        .create({
          baseURL: API_HOST,
          headers: {
            contentType: "application/json",
          },
        })
        .post<JwtTokens>("api/v1/admin/renew-token", null, {
          headers: {
            AuthorizationR: `Bearer ${await getValidatedRefreshToken()}`,
          },
        })
    ).data;
  } catch (e: unknown) {
    console.error(e);
    goLoginPage().then();
  }
}

export async function getValidatedAccessToken(): Promise<string> {
  let accessToken = window.localStorage.getItem("demo-accessToken");
  if (!accessToken || accessToken === "undefined") {
    await signOut();
    return "";
  }

  try {
    if (isExpiredToken(accessToken)) {
      const { reIssueAccessToken } = useAdminStore();
      await reIssueAccessToken();
      accessToken = window.localStorage.getItem("demo-accessToken");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    await signOut();
  }
  return accessToken ?? "";
}

export async function getValidatedRefreshToken(): Promise<string> {
  const refreshToken = window.localStorage.getItem("demo-refreshToken");
  if (!refreshToken || isExpiredToken(refreshToken)) {
    await signOut();
  }
  return refreshToken ?? "";
}
