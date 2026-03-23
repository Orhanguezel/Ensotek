// =============================================================
// FILE: src/integrations/shared/seoInlinePages.ts
// Sayfa bazli inline SEO tipleri ve sabitleri
// =============================================================

// ── Page-level SEO shape (matches DB seed: seo_pages) ──

export type SiteSettingsInlineSeoPage = {
  title: string;
  description: string;
  og_image: string;
  no_index: boolean;
};

export type SiteSettingsInlineSeoPageKey =
  | "home"
  | "product"
  | "sparepart"
  | "service"
  | "solutions"
  | "about"
  | "team"
  | "mission_vision"
  | "quality"
  | "news"
  | "blog"
  | "library"
  | "faqs"
  | "contact"
  | "offer"
  | "legal";

export type SiteSettingsInlineSeoPages = Record<SiteSettingsInlineSeoPageKey, SiteSettingsInlineSeoPage>;

// ── Page config (key + URL path) ──

export type SiteSettingsInlineSeoPageConfig = {
  key: SiteSettingsInlineSeoPageKey;
  path: string;
};

export const SITE_SETTINGS_INLINE_SEO_PAGES: SiteSettingsInlineSeoPageConfig[] = [
  { key: "home", path: "/" },
  { key: "product", path: "/products" },
  { key: "sparepart", path: "/spare-parts" },
  { key: "service", path: "/services" },
  { key: "solutions", path: "/solutions" },
  { key: "about", path: "/about" },
  { key: "team", path: "/about/team" },
  { key: "mission_vision", path: "/about/mission-vision" },
  { key: "quality", path: "/about/quality" },
  { key: "news", path: "/news" },
  { key: "blog", path: "/blog" },
  { key: "library", path: "/library" },
  { key: "faqs", path: "/faqs" },
  { key: "contact", path: "/contact" },
  { key: "offer", path: "/offer" },
  { key: "legal", path: "/legal" },
];

export const SITE_SETTINGS_INLINE_SEO_DEFAULT_EXPANDED_KEYS: SiteSettingsInlineSeoPageKey[] = [
  "home",
  "product",
  "service",
];

export const SITE_SETTINGS_INLINE_SEO_PREVIEW_HOST = "ensotek.de";
export const SITE_SETTINGS_INLINE_SEO_PREVIEW_HOST_WWW = "www.ensotek.de";

// ── Helpers ──

export function createEmptySiteSettingsInlineSeoPage(): SiteSettingsInlineSeoPage {
  return { title: "", description: "", og_image: "", no_index: false };
}

export function extractSiteSettingsInlineSeoPages(raw: unknown): SiteSettingsInlineSeoPages {
  const empty = () => createEmptySiteSettingsInlineSeoPage();
  const result = {} as Record<string, SiteSettingsInlineSeoPage>;

  let obj: Record<string, unknown> | null = null;

  if (raw && typeof raw === "object" && "value" in (raw as Record<string, unknown>)) {
    const val = (raw as Record<string, unknown>).value;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      obj = val as Record<string, unknown>;
    }
  } else if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    obj = raw as Record<string, unknown>;
  }

  for (const cfg of SITE_SETTINGS_INLINE_SEO_PAGES) {
    const src = obj?.[cfg.key];
    if (src && typeof src === "object" && !Array.isArray(src)) {
      const s = src as Record<string, unknown>;
      result[cfg.key] = {
        title: typeof s.title === "string" ? s.title : "",
        description: typeof s.description === "string" ? s.description : "",
        og_image: typeof s.og_image === "string" ? s.og_image : "",
        no_index: s.no_index === true,
      };
    } else {
      result[cfg.key] = empty();
    }
  }

  return result as SiteSettingsInlineSeoPages;
}

export function buildSiteSettingsInlineSeoPreviewPath(locale: string, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${locale}${clean}`;
}

export function getErrorMessage(err: unknown, fallback?: string): string {
  if (!err) return fallback || "";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") {
    const e = err as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
    if (e.data && typeof e.data === "object") {
      const d = e.data as Record<string, unknown>;
      if (typeof d.message === "string") return d.message;
    }
  }
  return fallback || "Unknown error";
}
