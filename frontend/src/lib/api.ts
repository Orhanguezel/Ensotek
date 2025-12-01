// src/lib/api.ts
import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { getApiBase, getClientCsrfToken, buildCommonHeaders } from "./http";
import { getEnvTenant } from "./config";
import { baseLocale } from "./strings";
import { isSupportedLocale, DEFAULT_LOCALE } from "@/i18n/config";
import type { SupportedLocale } from "@/types/common";

/** Base URL: absolute varsa onu kullan, yoksa /api */
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").trim() || getApiBase();

/** ---- Global aktif dil (runtime) ---- */
let CURRENT_LANG: SupportedLocale = DEFAULT_LOCALE;
export function setApiLang(lang?: string) {
  const b = baseLocale(lang || DEFAULT_LOCALE);
  if (isSupportedLocale(b)) {
    CURRENT_LANG = b as SupportedLocale;
    try { localStorage.setItem("lang", CURRENT_LANG); } catch {}
  }
}
function getLang(): SupportedLocale {
  if (typeof window === "undefined") return CURRENT_LANG; // SSR
  return CURRENT_LANG;
}

/** CSRF ısıtma — projede endpoint yoksa env ile belirle, yoksa generic yolları dene */
async function ensureCsrfCookie(): Promise<void> {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const customPath = (process.env.NEXT_PUBLIC_CSRF_WARMUP_PATH || "").trim();
  const candidates = [
    customPath && `${base}/${customPath.replace(/^\/+/, "")}`,
    `${base}/csrf`,
    `${base}/auth/csrf`,
    `${base}/ping`,
    `${base}/health`,
    `${base}/status`,
  ].filter(Boolean) as string[];

  for (const u of candidates) {
    try {
      await fetch(u, { credentials: "include", method: "GET" });
      return;
    } catch {
      // diğer adaya geç
    }
  }
}

/** Tekil Axios instance */
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/** Request interceptor: dil + tenant + csrf */
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { csrfDisabled?: boolean }) => {
    const baseHeaders = buildCommonHeaders(getLang(), getEnvTenant());
    const incoming = (config.headers || {}) as Record<string, any>;
    config.headers = {
      "accept-language": baseHeaders["Accept-Language"],
      "x-lang": baseHeaders["X-Lang"],
      "x-tenant": baseHeaders["X-Tenant"],
      "x-requested-with": "XMLHttpRequest",
      ...incoming,
    } as any;

    // CSRF (unsafe metodlarda)
    const method = (config.method || "get").toUpperCase();
    const unsafe = !["GET", "HEAD", "OPTIONS"].includes(method);
    if (unsafe && !config.csrfDisabled) {
      const { token } = getClientCsrfToken();
      if (token) (config.headers as any)["x-csrf-token"] = token;
    }
    return config;
  }
);

/** Response interceptor: 403/419 → (client’ta) ısıtma + 1 kez retry */
API.interceptors.response.use(
  (r) => r,
  async (err: AxiosError<any>) => {
    const cfg = (err.config || {}) as AxiosRequestConfig & {
      __retriedOnce?: boolean;
      csrfDisabled?: boolean;
    };
    const status = err.response?.status;

    if (
      typeof window !== "undefined" &&
      (status === 403 || status === 419) &&
      !cfg.__retriedOnce &&
      !cfg.csrfDisabled
    ) {
      try {
        await ensureCsrfCookie();
        cfg.__retriedOnce = true;
        return API.request(cfg);
      } catch {}
    }

    if (process.env.NODE_ENV !== "production" && (status === 401 || status === 403 || status === 419)) {
      // eslint-disable-next-line no-console
      console.warn("Auth/CSRF warning:", status, err?.response?.data);
    }
    return Promise.reject(err);
  }
);

export default API;

/* ---- Kısayollar ---- */
export function getJson<T = any>(url: string, cfg?: AxiosRequestConfig) {
  return API.get<T>(url, cfg);
}
export function postJson<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig) {
  return API.post<T>(url, data, {
    ...(cfg || {}),
    headers: { "Content-Type": "application/json", ...(cfg?.headers || {}) },
  });
}
export function putJson<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig) {
  return API.put<T>(url, data, {
    ...(cfg || {}),
    headers: { "Content-Type": "application/json", ...(cfg?.headers || {}) },
  });
}
export function patchJson<T = any>(url: string, data?: any, cfg?: AxiosRequestConfig) {
  return API.patch<T>(url, data, {
    ...(cfg || {}),
    headers: { "Content-Type": "application/json", ...(cfg?.headers || {}) },
  });
}
export function del<T = any>(url: string, cfg?: AxiosRequestConfig) {
  return API.delete<T>(url, cfg);
}
