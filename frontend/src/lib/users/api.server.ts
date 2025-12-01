import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type {
  ApiEnvelope,
  LiteUserPayload,
  RegisterBody,
  LoginBody,
  GoogleBody,
  FacebookBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from "./types";

const AUTH_BASE = "authlite";

async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute(); // e.g. https://localhost:5019/api
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

type Opts = { locale?: SupportedLocale; cookie?: string; revalidate?: number | false };

/** ortak fetch (POST/GET), cookie forward + no-store default */
async function call<T>(
  path: string,
  method: "GET" | "POST",
  body: unknown | undefined,
  opts?: Opts
): Promise<T> {
  const url = await abs(path);
  const tenant = await resolveTenant();
  const l = normalizeLocale(opts?.locale);

  const r = await fetch(url, {
    method,
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(opts?.cookie ? { cookie: opts.cookie } : {}),
    },
    credentials: "include",
    cache: typeof opts?.revalidate === "number" ? "force-cache" : "no-store",
    ...(typeof opts?.revalidate === "number" ? { next: { revalidate: opts.revalidate } } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });

  // 401 → null döndürmek isteyebiliriz (me için)
  if (!r.ok) {
    if (path.endsWith("/me") && r.status === 401) return null as T;
    throw new Error(`auth server call failed: ${r.status} ${path}`);
  }
  const j = (await r.json()) as ApiEnvelope<T>;
  return (j?.data ?? null) as T;
}

/* -------- SSR helpers -------- */

export async function fetchMeServer(opts?: Opts): Promise<LiteUserPayload | null> {
  return call<LiteUserPayload>(`${AUTH_BASE}/me`, "GET", undefined, opts).catch(() => null);
}

export async function postRegisterEmailServer(body: RegisterBody, opts?: Opts): Promise<LiteUserPayload> {
  return call<LiteUserPayload>(`${AUTH_BASE}/register-email`, "POST", body, opts);
}

export async function postLoginEmailServer(body: LoginBody, opts?: Opts): Promise<LiteUserPayload> {
  return call<LiteUserPayload>(`${AUTH_BASE}/login-email`, "POST", body, opts);
}

export async function postLoginGoogleServer(body: GoogleBody, opts?: Opts): Promise<LiteUserPayload> {
  return call<LiteUserPayload>(`${AUTH_BASE}/login-google`, "POST", body, opts);
}

export async function postLoginFacebookServer(body: FacebookBody, opts?: Opts): Promise<LiteUserPayload> {
  return call<LiteUserPayload>(`${AUTH_BASE}/login-facebook`, "POST", body, opts);
}

export async function postForgotPasswordServer(body: ForgotPasswordBody, opts?: Opts): Promise<{ success: boolean }> {
  await call<any>(`${AUTH_BASE}/forgot-password`, "POST", body, opts);
  return { success: true };
}

export async function postResetPasswordServer(body: ResetPasswordBody, opts?: Opts): Promise<LiteUserPayload> {
  return call<LiteUserPayload>(`${AUTH_BASE}/reset-password`, "POST", body, opts);
}

/* ---- DEV: aktif reset kodunu gör (yalnızca dev router açıkken 200 döner) ---- */
export async function devPeekResetServer(email: string, opts?: Opts): Promise<{ code: string; token: string; expiresAt: string } | null> {
  try {
    const base = await abs(`${AUTH_BASE}/__dev/peek-reset?email=${encodeURIComponent(email)}`);
    const tenant = await resolveTenant();
    const l = normalizeLocale(opts?.locale);

    const r = await fetch(base, {
      headers: {
        ...buildCommonHeaders(l, tenant),
        ...(opts?.cookie ? { cookie: opts.cookie } : {}),
      },
      cache: "no-store",
      credentials: "include",
    });
    if (!r.ok) return null;
    const j = (await r.json()) as ApiEnvelope<{ code: string; token: string; expiresAt: string }>;
    return j?.data ?? null;
  } catch {
    return null;
  }
}
