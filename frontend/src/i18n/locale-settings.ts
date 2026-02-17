import { AVAILABLE_LOCALES, FALLBACK_LOCALE } from "./locales";

type LocaleSettings = {
  activeLocales: string[];
  defaultLocale: string;
};

type BackendLocale = {
  code?: string;
  is_active?: boolean;
};

export const API_BASE_URL_RAW =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8086/api";
export const API_BASE_URL = API_BASE_URL_RAW.endsWith("/api")
  ? API_BASE_URL_RAW
  : `${API_BASE_URL_RAW}/api`;

function normalizeLocale(value: unknown): string {
  if (typeof value !== "string") return "";
  const normalized = value.trim().toLowerCase().replace("_", "-");
  if (!normalized) return "";
  return normalized.split("-")[0] || "";
}

function toActiveLocales(payload: unknown): string[] {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown[] })?.data)
      ? (payload as { data: unknown[] }).data
      : [];

  const locales = list
    .filter((item) => (item as BackendLocale)?.is_active !== false)
    .map((item: unknown) => normalizeLocale((item as BackendLocale)?.code))
    .filter((code) => AVAILABLE_LOCALES.includes(code));

  return Array.from(new Set(locales));
}

function toDefaultLocale(payload: unknown): string {
  if (typeof payload === "string") return normalizeLocale(payload);
  if (typeof payload === "object" && payload !== null) {
    return normalizeLocale((payload as { locale?: string }).locale);
  }
  return "";
}

export async function getRuntimeLocaleSettings(): Promise<LocaleSettings> {
  const fallback: LocaleSettings = {
    activeLocales: AVAILABLE_LOCALES,
    defaultLocale: FALLBACK_LOCALE,
  };

  try {
    const [localesResponse, defaultLocaleResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/site_settings/app-locales`, {
        cache: "no-store",
      }),
      fetch(`${API_BASE_URL}/site_settings/default-locale`, {
        cache: "no-store",
      }),
    ]);

    const localesPayload = localesResponse.ok ? await localesResponse.json() : [];
    const defaultPayload = defaultLocaleResponse.ok
      ? await defaultLocaleResponse.json()
      : {};

    const activeLocales = toActiveLocales(localesPayload);
    const scopedActiveLocales =
      activeLocales.length > 0 ? activeLocales : AVAILABLE_LOCALES;

    const candidateDefault = toDefaultLocale(defaultPayload);
    const defaultLocale = scopedActiveLocales.includes(candidateDefault)
      ? candidateDefault
      : scopedActiveLocales[0] ?? FALLBACK_LOCALE;

    return {
      activeLocales: scopedActiveLocales,
      defaultLocale,
    };
  } catch {
    return fallback;
  }
}
