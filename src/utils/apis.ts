import type { CancelTokenSource } from "axios";
import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_HOST } from "@/constants/envs";
import { getValidatedAccessToken, goLoginPage } from "@/utils/commands";
import { stringify } from "qs";
import { v4 as uuidV4 } from "uuid";
import { useAdminStore } from "@/stores/admin";
import { push } from "notivue";

export const axiosInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

export interface ApiResponse<T> extends AxiosResponse<T> {
  success: boolean;
}

export const pendingRequests = new Map<string, CancelTokenSource>();

axiosInstance.interceptors.request.use(
  async function (config) {
    if (!config.headers) {
      console.error("Failed to set 'request headers' : headers is not exist");
      return {} as InternalAxiosRequestConfig;
    }
    const accessToken = await getValidatedAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 요청 ID 생성
    const requestId = uuidV4();
    const cancelToken = axios.CancelToken.source();

    config.cancelToken = cancelToken.token;
    config.headers.requestId = requestId; // meta 객체가 없을 수도 있으므로 스프레드 연산자를 사용

    // 요청 ID를 키로 사용하여 cancelToken 저장
    pendingRequests.set(requestId, cancelToken);

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    const requestId = response.config.headers.requestId;
    pendingRequests.delete(requestId);

    if (!response) {
      push.error("응답이 없습니다.");
    }
    return { ...response, success: Math.floor(response.status / 100) === 2 };
  },
  async function (error: AxiosError) {
    console.error(error.message);
    const requestId = error.config?.headers?.requestId;
    requestId && pendingRequests.delete(requestId);
    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    if (error.message === "Network Error") {
      push.error("서비스 이용 불가");
      return;
    }
    if (error.response) {
      if (error.response.headers.token === "must-renew") {
        const { reIssueAccessToken } = useAdminStore();
        await reIssueAccessToken();
        error.response.config.headers.Authorization =
          await getValidatedAccessToken();
        return axiosInstance.request(error.response.config);
      }
      if ([401].includes(error.response.status)) {
        await goLoginPage();
        return;
      }
    }
    console.error(error);
    return Promise.reject(error);
  },
);

export async function getApi<T = never, R = T>(
  url: string,
  alert = true,
): Promise<ApiResponse<R>> {
  try {
    return await axiosInstance.get<T, ApiResponse<R>>(url);
  } catch (e) {
    return catchError<R>(e, alert);
  }
}

export async function postApi<T = never, R = T>(
  url: string,
  data: T,
  alert = true,
  successMessage = "등록되었습니다.",
): Promise<ApiResponse<R>> {
  try {
    const response = await axiosInstance.post<T, ApiResponse<R>>(url, data);
    if (alert && response.success) {
      push.success(successMessage);
    }
    return response;
  } catch (e) {
    return catchError<R>(e, alert);
  }
}

export async function putApi<T = never, R = T>(
  url: string,
  data: T,
  alert = true,
  successMessage = "수정되었습니다.",
): Promise<ApiResponse<R>> {
  try {
    const response = await axiosInstance.put<T, ApiResponse<R>>(url, data);
    if (alert && response.success) {
      push.success(successMessage);
    }
    return response;
  } catch (e) {
    return catchError<R>(e, alert);
  }
}

export async function patchApi<T = never, R = T>(
  url: string,
  data: T,
  alert = true,
  successMessage = "처리되었습니다.",
): Promise<ApiResponse<R>> {
  try {
    const response = await axiosInstance.patch<T, ApiResponse<R>>(url, data);
    if (alert && response.success) {
      push.success(successMessage);
    }
    return response;
  } catch (e) {
    return catchError<R>(e, alert);
  }
}

export async function deleteApi<T = never, R = T>(
  url: string,
  alert = true,
  successMessage = "삭제되었습니다.",
): Promise<ApiResponse<R>> {
  try {
    const response = await axiosInstance.delete<T, ApiResponse<R>>(url);
    if (alert && response.success) {
      push.success(successMessage);
    }
    return response;
  } catch (e) {
    return catchError<R>(e, alert);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringifyParams(obj: any): string {
  return stringify(
    Object.keys(obj)
      .filter((key) => typeof obj[key] !== "string" || obj[key].trim() !== "")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((prev: any, key) => {
        prev[key] = obj[key];
        return prev;
      }, {}),
    { arrayFormat: "repeat", skipNulls: true },
  );
}

export function catchError<T>(e, alert: boolean): ApiResponse<T> {
  if (Math.floor(e.status / 100) === 4) {
    console.warn(e);
    if (alert) {
      push.error(e.response.data.message);
    }
    return {
      status: e.status,
      statusText: e.statusText,
      config: e.config,
      headers: e.headers,
      request: e.request,
      data: null as T,
      success: false,
    };
  } else {
    console.error(e);
    if (alert) {
      push.error(e.response.data.message);
    }
    throw e;
  }
}
