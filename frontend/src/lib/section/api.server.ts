import type {
  ISection,
  SectionListQuery,
  SectionAdminListQuery,
  SectionCreatePayload,
  SectionUpdatePayload,
} from "./types";

import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import { buildCommonHeaders } from "@/lib/http";

/* ------------------------------------------------------- */
/* helpers                                                 */
/* ------------------------------------------------------- */
function cleanBase(u: string) {
  return u.replace(/\/+$/, "");
}

function buildQuery(params: Record<string, any>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "" || Number.isNaN(v)) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      q.set(k, v.join(","));
    } else {
      q.set(k, String(v));
    }
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

/* ------------------------------------------------------- */
/* Public: enabled section list                            */
/* GET /section?keys=...&zone=...&components=...           */
/* ------------------------------------------------------- */
export async function fetchSectionListServer({
  locale,
  keys,
  zone,
  components,
  revalidate = 300,
}: SectionListQuery = {}): Promise<ISection[]> {
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url = `${base}/section${buildQuery({ keys, zone, components })}`;

    const tenant = await resolveTenant();
    const l = normalizeLocale(locale || "en");

    const res = await fetch(url, {
      headers: buildCommonHeaders(l, tenant),
      cache: "force-cache",
      next: { revalidate },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const list: ISection[] = Array.isArray(j) ? j : (j?.data ?? []);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------- */
/* Admin: full list (auth gerekir)                         */
/* GET /section/admin                                      */
/* headers?: { Authorization: 'Bearer ...' }               */
/* ------------------------------------------------------- */
export async function fetchSectionListAdminServer({
  locale,
  revalidate = 60,
  headers = {},
  zone,
  components,
  keys,
  page,
  limit,
  sort,
}: SectionAdminListQuery = {}): Promise<ISection[]> {
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url = `${base}/section/admin${buildQuery({ zone, components, keys, page, limit, sort })}`;

    const tenant = await resolveTenant();
    const l = normalizeLocale(locale || "en");

    const res = await fetch(url, {
      headers: { ...buildCommonHeaders(l, tenant), ...headers },
      cache: "no-store",
      next: { revalidate },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    // admin uçta { data: { items, page, ... } } geliyor olabilir
    const list: ISection[] = Array.isArray(j) ? j : (j?.data?.items ?? j?.data ?? []);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------- */
/* Admin: create/update/toggle/delete (auth gerekir)       */
/* ------------------------------------------------------- */
export async function createSectionServer(
  payload: SectionCreatePayload,
  opts: { locale?: string; headers?: Record<string, string> } = {}
): Promise<ISection | null> {
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url = `${base}/section`;

    const tenant = await resolveTenant();
    const l = normalizeLocale(opts.locale || "en");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...buildCommonHeaders(l, tenant),
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    return (j?.data ?? null) as ISection | null;
  } catch {
    return null;
  }
}

export async function updateSectionServer(
  sectionKey: string,
  updates: SectionUpdatePayload,
  opts: { locale?: string; headers?: Record<string, string> } = {}
): Promise<ISection | null> {
  if (!sectionKey) return null;
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url = `${base}/section/${encodeURIComponent(sectionKey)}`;

    const tenant = await resolveTenant();
    const l = normalizeLocale(opts.locale || "en");

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        ...buildCommonHeaders(l, tenant),
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
      body: JSON.stringify(updates),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    return (j?.data ?? null) as ISection | null;
  } catch {
    return null;
  }
}

export async function toggleSectionServer(
  sectionKey: string,
  opts: { locale?: string; headers?: Record<string, string> } = {}
): Promise<ISection | null> {
  if (!sectionKey) return null;
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url = `${base}/section/${encodeURIComponent(sectionKey)}/toggle`;

    const tenant = await resolveTenant();
    const l = normalizeLocale(opts.locale || "en");

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        ...buildCommonHeaders(l, tenant),
        ...(opts.headers || {}),
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    return (j?.data ?? null) as ISection | null;
  } catch {
    return null;
  }
}

export async function deleteSectionServer(
  sectionKey: string,
  opts: { locale?: string; headers?: Record<string, string> } = {}
): Promise<boolean> {
  if (!sectionKey) return false;
  try {
    const base = cleanBase(await getServerApiBaseAbsolute());
    const url = `${base}/section/${encodeURIComponent(sectionKey)}`;

    const tenant = await resolveTenant();
    const l = normalizeLocale(opts.locale || "en");

    const res = await fetch(url, {
      method: "DELETE",
      headers: { ...buildCommonHeaders(l, tenant), ...(opts.headers || {}) },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch {
    return false;
  }
}
