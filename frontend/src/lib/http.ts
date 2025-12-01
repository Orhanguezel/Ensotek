import { ensureLeadingSlash, stripTrailingSlash, baseLocale } from "./strings";
import { getEnvTenant, getEnvDefaultLocale } from "./config";
import { isSupportedLocale, DEFAULT_LOCALE } from "@/i18n/config";
import type { SupportedLocale } from "@/types/common";

/** /api tabanı (same-origin default) */
export function getApiBase(): string {
  const raw = (process.env.NEXT_PUBLIC_API_BASE || "/api").trim();
  const base = ensureLeadingSlash(raw);
  return stripTrailingSlash(base) || "/api";
}

/** Ortak başlık üretimi – tek nokta
 * - locale: verilmezse DEFAULT_LOCALE
 * - tenant: verilmezse env’den alınır
 */
export function buildCommonHeaders(
  locale?: string | SupportedLocale,
  tenant?: string
): Record<string, string> {
  const cand = baseLocale(locale || getEnvDefaultLocale());
  const l: SupportedLocale = isSupportedLocale(cand) ? (cand as SupportedLocale) : DEFAULT_LOCALE;
  const t = (tenant || getEnvTenant()).toLowerCase();

  // Node/Express header erişimi lower-case olur; burada key'ler standard casing ile
  return {
    "Accept-Language": l,
    "X-Lang": l,
    "X-Tenant": t,
  };
}

/** Client’ta CSRF cookie oku */
function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const re = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`);
  const m = document.cookie.match(re);
  return m ? decodeURIComponent(m[1]) : "";
}

/** Client CSRF token (meta > cookie) */
export function getClientCsrfToken(): { token: string; source: "meta" | "cookie" | "none" } {
  if (typeof document === "undefined") return { token: "", source: "none" };

  const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
  if (meta?.content) return { token: meta.content, source: "meta" };

  const cookieName =
    process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME ||
    process.env.CSRF_COOKIE_NAME ||
    "tt_csrf";

  const v = readCookie(cookieName);
  if (v) return { token: (v.split("|")[0] || v), source: "cookie" };
  return { token: "", source: "none" };
}

/** RSC/SSR için same-origin relative URL
 *  - Mutlak URL istiyorsan NEXT_PUBLIC_API_URL kullanabilirsin.
 */
export function getServerApiUrl(path = ""): string {
  const absolute = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  const base = absolute || getApiBase();
  const isAbs = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(base);
  const cleanBase = base.replace(/\/+$/, "");
  const p = String(path || "").replace(/^\/+/, "");
  if (isAbs) return p ? `${cleanBase}/${p}` : cleanBase;
  const relBase = ensureLeadingSlash(cleanBase);
  return p ? `${relBase}/${p}` : relBase;
}
