import router from "@/router";
import { type, stringifyParams } from "@/utils/apis";
import { useAdminStore } from "@/stores/admin";
import { parse } from "qs";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import axios from "axios";
import { type JwtTokens } from "@/definitions/types";
import { toast } from "vue3-toastify";
import { storeToRefs } from "pinia";
import { API_HOST } from "@/constants/envs";

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
  const { clearAdmin } = useAdminStore();
  clearAdmin();
}

export async function goLoginPage(): Promise<void> {
  const { clearAdmin } = useAdminStore();
  clearAdmin();
  await routerReplace("/login");
}

export async function getNewToken(): Promise<JwtTokens | undefined> {
  try {
    const { data } = await axios
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
      });
    return data.returnData;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      const statusCode = e.response?.status || 500;
      if (statusCode === 401 || e.message === "Invalid token specified!") {
        toast.error(e.message);
      } else if ([403, 404, 500].includes(statusCode)) {
        toast.error(e.message);
      } else {
        console.warn(`Missing Status Code: ${statusCode}`);
        toast.error(e.message);
      }
    } else {
      console.error(e);
    }
  }
}

export async function getValidatedAccessToken(): Promise<string> {
  let accessToken = window.localStorage.getItem("demo-accessToken");
  if (!accessToken || accessToken === "undefined") {
    await signOut();
  }

  try {
    if (isExpiredToken(accessToken)) {
      const { reIssueAccessToken } = useAdminStore();
      await reIssueAccessToken();
      accessToken = window.localStorage.getItem("demo-accessToken");
    }
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
