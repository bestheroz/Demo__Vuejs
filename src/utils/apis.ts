import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Method,
} from "axios";
import { stringify } from "qs";
import { v4 as uuidV4 } from "uuid";
import { API_HOST } from "@/constants/envs";
import { useAdminStore } from "@/stores/admin";
import { getValidatedAccessToken, goLoginPage } from "@/utils/commands";
import { toastError } from "@/utils/toaster";
import { toast } from "vue-sonner";
import { Ref } from "vue";

export const axiosInstance = axios.create({
  baseURL: API_HOST,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

export interface ApiResponse<T> extends AxiosResponse<T> {
  success: boolean;
}

export interface ApiOptions {
  refLoading?: Ref<boolean>;
  alert?: boolean;
  successAlert?: boolean;
  successMessage?: string;
  failureAlert?: boolean;
  failureMessage?: string;
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
      toastError("응답이 없습니다.");
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
      toastError("서비스 이용 불가");
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

function getDefaultOptions(method: Method, options?: ApiOptions): ApiOptions {
  const defaultOpts = {
    successMessage: undefined,
    refLoading: undefined,
    alert: undefined,
    successAlert: method !== "get",
    failureAlert: true,
    failureMessage: undefined,
  };

  const mergedOptions = {
    ...defaultOpts,
    ...options,
  };

  return {
    ...mergedOptions,
    successAlert: mergedOptions.alert ?? mergedOptions.successAlert,
    failureAlert: mergedOptions.alert ?? mergedOptions.failureAlert,
  };
}

function getPromiseMessage<T>(
  successMessage: string,
  successAlert?: boolean,
  failureAlert?: boolean,
  failureMessage?: string,
) {
  return {
    success: successAlert
      ? ({ success }: ApiResponse<T>) => {
          if (successAlert && success) {
            return successMessage;
          }
        }
      : undefined,
    error: failureAlert
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: any) => {
          console.warn(e);
          return failureMessage ?? e.response?.data?.message ?? e.message;
        }
      : undefined,
  };
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
      toastError(e.response.data.message);
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
      toastError(e.response?.data?.message ?? e.message);
    }
    throw e;
  }
}

async function executeRequest<T = never, R = T>(
  method: Method,
  url: string,
  data?: T,
  options?: ApiOptions,
): Promise<ApiResponse<R>> {
  const {
    refLoading,
    successAlert,
    successMessage,
    failureAlert,
    failureMessage,
  } = { ...getDefaultOptions(method, options) };

  const controller = new AbortController();
  const defaultSuccessMessages: Record<string, string> = {
    get: "조회되었습니다.",
    post: "등록되었습니다.",
    put: "수정되었습니다.",
    patch: "수정되었습니다.",
    delete: "삭제되었습니다.",
  };

  try {
    if (refLoading?.value) {
      refLoading.value = true;
    }

    const requestConfig = {
      method,
      url,
      data: method !== "get" && method !== "delete" ? data : undefined,
      signal: controller.signal,
    };

    const _promise = axiosInstance.request<T, ApiResponse<R>>(requestConfig);

    if (method !== "get") {
      toast.promise(
        _promise,
        getPromiseMessage(
          successMessage ?? defaultSuccessMessages[method] ?? "처리되었습니다.",
          successAlert,
          failureAlert,
          failureMessage,
        ),
      );
    }

    return await _promise;
  } catch (e) {
    return catchError<R>(e, options?.failureAlert ?? true);
  } finally {
    if (refLoading?.value) {
      refLoading.value = false;
    }
  }
}

export async function getApi<T = never, R = T>(
  url: string,
  options?: ApiOptions,
): Promise<ApiResponse<R>> {
  return executeRequest<T, R>("get", url, undefined, options);
}

export async function postApi<T = never, R = T>(
  url: string,
  data: T,
  options?: ApiOptions,
): Promise<ApiResponse<R>> {
  return executeRequest<T, R>("post", url, data, options);
}

export async function putApi<T = never, R = T>(
  url: string,
  data: T,
  options?: ApiOptions,
): Promise<ApiResponse<R>> {
  return executeRequest<T, R>("put", url, data, options);
}

export async function patchApi<T = never, R = T>(
  url: string,
  data: T,
  options?: ApiOptions,
): Promise<ApiResponse<R>> {
  return executeRequest<T, R>("patch", url, data, options);
}

export async function deleteApi<T = never, R = T>(
  url: string,
  options?: ApiOptions,
): Promise<ApiResponse<R>> {
  return executeRequest<T, R>("delete", url, undefined, options);
}

export function stringifyParams(obj: Record<string, unknown>): string {
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
