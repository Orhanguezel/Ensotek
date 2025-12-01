// src/lib/gallery/api.server.ts

import type { SupportedLocale } from "@/types/common";
import type { IGallery } from "@/lib/gallery/types";

import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import { buildCommonHeaders } from "@/lib/http";

/** Liste sorgu tipleri (about modülündeki standarda yakın, genişletilmiş) */
export type GalleryListQuery = {
  locale: SupportedLocale;
  limit?: number;
  sort?: string;            // "-publishedAt" vb.
  page?: number;
  q?: string;
  type?: "image" | "video";
  /** id veya slug — backend tek param "category" üzerinden her ikisini de kabul ediyor */
  category?: string;
  /** tekil veya multiple tag */
  tags?: string | string[];
  /** alan seçimi */
  select?: string;          // "title,summary,slug,images,category,tags"
  /** populate seçenekleri */
  populate?: string;        // "category"
  revalidate?: number;
};

function cleanBase(u: string) {
  return u.replace(/\/+$/, "");
}

function buildQuery(params: Record<string, any>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "" || Number.isNaN(v)) return;
    if (Array.isArray(v)) {
      v.filter((x) => x != null && x !== "").forEach((x) => q.append(k, String(x)));
    } else {
      q.set(k, String(v));
    }
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

/** Public list (yalnızca yayınlanmış/aktif öğeler) — /gallery/published */
export async function fetchGalleryListServer({
  locale,
  limit = 24,
  sort = "-publishedAt",
  page = 1,
  q,
  type,
  category,
  tags,
  select,
  populate,
  revalidate = 300,
}: GalleryListQuery): Promise<IGallery[]> {
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url =
      `${base}/gallery/published` +
      buildQuery({ limit, sort, page, q, type, category, tags, select, populate });

    const tenant = await resolveTenant();
    const l = normalizeLocale(locale);

    const res = await fetch(url, {
      headers: buildCommonHeaders(l, tenant),
      cache: "force-cache",
      next: { revalidate },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const list: IGallery[] = Array.isArray(j) ? j : (j?.data ?? []);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** /gallery/:id */
export async function fetchGalleryByIdServer(
  id: string,
  locale: SupportedLocale,
  revalidate = 300
): Promise<IGallery | null> {
  if (!id) return null;
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url = `${base}/gallery/${encodeURIComponent(id)}`;

    const tenant = await resolveTenant();
    const l = normalizeLocale(locale);

    const res = await fetch(url, {
      headers: buildCommonHeaders(l, tenant),
      cache: "force-cache",
      next: { revalidate },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const item: IGallery | null = (j?.data ?? j) || null;
    return item && typeof item === "object" ? (item as IGallery) : null;
  } catch {
    return null;
  }
}

/** /gallery/slug/:slug */
export async function fetchGalleryBySlugServer(
  slug: string,
  locale: SupportedLocale,
  revalidate = 300
): Promise<IGallery | null> {
  if (!slug) return null;
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url = `${base}/gallery/slug/${encodeURIComponent(slug)}`;

    const tenant = await resolveTenant();
    const l = normalizeLocale(locale);

    const res = await fetch(url, {
      headers: buildCommonHeaders(l, tenant),
      cache: "force-cache",
      next: { revalidate },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const item: IGallery | null = (j?.data ?? j) || null;
    return item && typeof item === "object" ? (item as IGallery) : null;
  } catch {
    return null;
  }
}
