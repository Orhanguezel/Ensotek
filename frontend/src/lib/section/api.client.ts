import type {
  ISection,
  SectionListQuery,
  SectionCreatePayload,
  SectionUpdatePayload,
} from "./types";

/* ------------------------------------------------------- */
/* base + helpers                                          */
/* ------------------------------------------------------- */
function getClientApiBase() {
  const raw = (process.env.NEXT_PUBLIC_API_BASE || "/api").trim();
  const isAbs = /^https?:\/\//i.test(raw);
  const lead = isAbs ? raw : (raw.startsWith("/") ? raw : `/${raw}`);
  return lead.replace(/\/+$/, "");
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
/* GET /section?keys=hero,about&zone=home&components=hero  */
/* ------------------------------------------------------- */
export async function fetchSectionListClient(
  opts: SectionListQuery = {}
): Promise<ISection[]> {
  const { locale, keys, zone, components } = opts;
  const base = getClientApiBase();
  const url = `${base}/section${buildQuery({ keys, zone, components })}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
        "X-Requested-With": "fetch",
      },
      cache: "no-store",
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
/* ------------------------------------------------------- */
export async function fetchSectionListAdminClient(
  opts: {
    locale?: string;
    authToken?: string;
    zone?: string;
    components?: string | string[];
    keys?: string | string[];
    page?: number;
    limit?: number;
    sort?: string;
  } = {}
): Promise<ISection[]> {
  const { locale, authToken, zone, components, keys, page, limit, sort } = opts;
  const base = getClientApiBase();
  const url = `${base}/section/admin${buildQuery({ zone, components, keys, page, limit, sort })}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        "X-Requested-With": "fetch",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const list: ISection[] = Array.isArray(j) ? j : (j?.data?.items ?? j?.data ?? []);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------- */
/* Admin: create/update/toggle/delete (auth gerekir)       */
/* ------------------------------------------------------- */
export async function createSectionClient(
  payload: SectionCreatePayload,
  opts: { locale?: string; authToken?: string } = {}
): Promise<ISection | null> {
  const { locale, authToken } = opts;
  const base = getClientApiBase();
  const url = `${base}/section`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        "Content-Type": "application/json",
        "X-Requested-With": "fetch",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    return (j?.data ?? null) as ISection | null;
  } catch {
    return null;
  }
}

export async function updateSectionClient(
  sectionKey: string,
  updates: SectionUpdatePayload,
  opts: { locale?: string; authToken?: string } = {}
): Promise<ISection | null> {
  if (!sectionKey) return null;
  const { locale, authToken } = opts;
  const base = getClientApiBase();
  const url = `${base}/section/${encodeURIComponent(sectionKey)}`;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        "Content-Type": "application/json",
        "X-Requested-With": "fetch",
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    return (j?.data ?? null) as ISection | null;
  } catch {
    return null;
  }
}

export async function toggleSectionClient(
  sectionKey: string,
  opts: { locale?: string; authToken?: string } = {}
): Promise<ISection | null> {
  if (!sectionKey) return null;
  const { locale, authToken } = opts;
  const base = getClientApiBase();
  const url = `${base}/section/${encodeURIComponent(sectionKey)}/toggle`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        "X-Requested-With": "fetch",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    return (j?.data ?? null) as ISection | null;
  } catch {
    return null;
  }
}

export async function deleteSectionClient(
  sectionKey: string,
  opts: { locale?: string; authToken?: string } = {}
): Promise<boolean> {
  if (!sectionKey) return false;
  const { locale, authToken } = opts;
  const base = getClientApiBase();
  const url = `${base}/section/${encodeURIComponent(sectionKey)}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        ...(locale ? { "Accept-Language": locale } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        "X-Requested-With": "fetch",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch {
    return false;
  }
}
