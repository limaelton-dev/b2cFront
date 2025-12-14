import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BASE_URL) {
  console.warn('[HTTP] NEXT_PUBLIC_BACKEND_URL não está definido. As requisições podem falhar.');
}

// ---------- Tipos ----------
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export type HttpOptions<TReq = any> = Omit<AxiosRequestConfig<TReq>, "url" | "baseURL">;

// ---------- Helpers internos ----------
function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    const status = err.response?.status ?? 0;
    const message =
      err.response?.data?.message ??
      err.message ??
      "Erro de comunicação com o servidor.";
    return { status, message, details: err.response?.data };
  }
  return { status: 0, message: "Erro inesperado.", details: error };
}

function isFormData(v: unknown): v is FormData {
  return typeof FormData !== "undefined" && v instanceof FormData;
}

// ---------- Singleton do Axios ----------
let _instance: AxiosInstance | null = null;

function createAxios(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // 30 segundos
    withCredentials: false, // Desabilitado para evitar problemas de CORS
  });

  // Request Interceptor
  instance.interceptors.request.use((config) => {
    // Garanta que headers é um AxiosHeaders
    const headers = AxiosHeaders.from(config.headers);

    // Content-Type padrão (exceto GET e quando for FormData)
    const method = (config.method ?? "get").toLowerCase();
    if (method !== "get" && !isFormData(config.data)) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }

    // Authorization (se existir token e não for rota /auth)
    const token = getToken(); // null se não existir (ou se migrar para httpOnly)
    const url = config.url ?? "";
    const isAuthRoute = url.startsWith("/auth/");
    if (token && !isAuthRoute) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    config.headers = headers; // <-- atribui a instância de AxiosHeaders
    return config;
  });

  // Response Interceptor
  instance.interceptors.response.use(
    (resp: AxiosResponse) => resp,
    async (error: AxiosError) => {
      // (TODO: refresh token / redirect)
      return Promise.reject(error);
    }
  );

  return instance;
}

export function http(): AxiosInstance {
  if (!_instance) _instance = createAxios();
  return _instance;
}

// ---------- Wrapper que sempre devolve data ----------
export async function httpClient<TResp = any, TReq = any>(
  url: string,
  options?: HttpOptions<TReq>
): Promise<TResp> {
  try {
    const resp = await http().request<TResp>({ url, ...options });
    return resp.data;
  } catch (err) {
    throw normalizeError(err);
  }
}

// ---------- Açúcares opcionais ----------
export const get = <TResp = any>(url: string, cfg?: HttpOptions) =>
  httpClient<TResp>(url, { ...cfg, method: "GET" });

export const post = <TResp = any, TReq = any>(
  url: string,
  data?: TReq,
  cfg?: HttpOptions<TReq>
) => httpClient<TResp, TReq>(url, { ...cfg, method: "POST", data });

export const patch = <TResp = any, TReq = any>(
  url: string,
  data?: TReq,
  cfg?: HttpOptions<TReq>
) => httpClient<TResp, TReq>(url, { ...cfg, method: "PATCH", data });

export const put = <TResp = any, TReq = any>(
  url: string,
  data?: TReq,
  cfg?: HttpOptions<TReq>
) => httpClient<TResp, TReq>(url, { ...cfg, method: "PUT", data });

export const del = <TResp = any, TReq = any>(
  url: string,
  data?: TReq,
  cfg?: HttpOptions<TReq>
) => httpClient<TResp, TReq>(url, { ...cfg, method: "DELETE", data });
