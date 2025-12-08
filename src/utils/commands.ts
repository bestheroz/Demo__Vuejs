import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { parse } from "qs";
import { API_HOST } from "@/constants/envs";
import type { JwtTokens } from "@/definitions/types";
import router from "@/router";
import { useAdminStore } from "@/stores/admin";
import { stringifyParams } from "@/utils/apis";
import { logger } from "@/utils/logger";
import { tokenStorage } from "@/utils/storage";

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
    logger.warn("Token validation failed:", e);
    return true;
  }
}

export async function signOut(): Promise<void> {
  try {
    await goLoginPage();
  } catch (error) {
    logger.error("Sign out failed:", error);
  }
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
            "Content-Type": "application/json",
          },
        })
        .post<JwtTokens>("api/v1/admin/renew-token", null, {
          headers: {
            Authorization: `Bearer ${await getValidatedRefreshToken()}`,
          },
        })
    ).data;
  } catch (e: unknown) {
    logger.error("Token renewal failed:", e);
    try {
      await goLoginPage();
    } catch (loginError) {
      logger.error("Login redirect failed:", loginError);
    }
    return undefined;
  }
}

export async function getValidatedAccessToken(): Promise<string> {
  let accessToken = tokenStorage.getAccessToken();
  if (!accessToken || accessToken === "undefined") {
    await signOut();
    return "";
  }

  try {
    if (isExpiredToken(accessToken)) {
      const { reIssueAccessToken } = useAdminStore();
      await reIssueAccessToken();
      accessToken = tokenStorage.getAccessToken();
    }
  } catch (_: unknown) {
    await signOut();
  }
  return accessToken ?? "";
}

export async function getValidatedRefreshToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken || isExpiredToken(refreshToken)) {
    await signOut();
    return "";
  }
  return refreshToken;
}
