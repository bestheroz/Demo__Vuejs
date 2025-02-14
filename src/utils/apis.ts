import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { push } from "notivue";
import { stringify } from "qs";
import { v4 as uuidV4 } from "uuid";
import { API_HOST } from "@/constants/envs";
import { useAdminStore } from "@/stores/admin";
import { getValidatedAccessToken, goLoginPage } from "@/utils/commands";

export const axiosInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

export interface ApiResponse<T> extends AxiosResponse<T> {
  success: boolean;
}

export const pendingRequests: Map<string, AbortController> = new Map();

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
    const controller = new AbortController();

    config.signal = controller.signal;
    config.headers.requestId = requestId;

    pendingRequests.set(requestId, controller);

    return config;
  },
  async function (error) {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    const requestId = response.config.headers.requestId as string;
    if (requestId) {
      pendingRequests.delete(requestId);
    }

    if (!response) {
      push.error("응답이 없습니다.");
    }
    return { ...response, success: Math.floor(response.status / 100) === 2 };
  },
  async function (error: AxiosError) {
    console.error(error.message);

    const requestId = error.config?.headers?.requestId;
    if (requestId) {
      pendingRequests.delete(requestId);
    }

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
  const controller = new AbortController();
  try {
    return await axiosInstance.get<T, ApiResponse<R>>(url, {
      signal: controller.signal,
    });
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
  const controller = new AbortController();
  try {
    const response = await axiosInstance.post<T, ApiResponse<R>>(url, data, {
      signal: controller.signal,
    });
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
  const controller = new AbortController();
  try {
    const response = await axiosInstance.put<T, ApiResponse<R>>(url, data, {
      signal: controller.signal,
    });
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
  const controller = new AbortController();
  try {
    const response = await axiosInstance.patch<T, ApiResponse<R>>(url, data, {
      signal: controller.signal,
    });
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
  const controller = new AbortController();
  try {
    const response = await axiosInstance.delete<T, ApiResponse<R>>(url, {
      signal: controller.signal,
    });
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
  const safeObject = new Map(
    Object.entries(obj).filter(
      ([_, value]) => typeof value !== "string" || value.trim() !== "",
    ),
  );

  const sanitizedObject = Object.fromEntries(safeObject);

  return stringify(sanitizedObject, {
    arrayFormat: "repeat",
    skipNulls: true,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function catchError<T>(e: any, alert: boolean = true): ApiResponse<T> {
  if (e.code === "ERR_CANCELED") {
    return {
      status: e.status,
      statusText: e.statusText,
      config: e.config,
      headers: e.headers,
      request: e.request,
      data: e.response?.data as T,
      success: false,
    };
  }
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
      data: e.response.data as T,
      success: false,
    };
  } else {
    console.error(e);
    if (alert) {
      push.error(e.response?.data?.message ?? e.message);
    }
    throw e;
  }
}
