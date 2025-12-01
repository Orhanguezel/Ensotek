import { getServerApiBaseAbsolute } from "@/lib/server/http";
import { buildCommonHeaders } from "@/lib/http";
import { resolveTenant } from "@/lib/server/tenant";
import { normalizeLocale } from "@/lib/server/locale";
import type { SupportedLocale } from "@/types/common";
import type {
  IFaq,
  ApiEnvelope,
  FaqListParams,
  CreateFaqInput,
  UpdateFaqInput,
  DeleteFaqInput,
  TogglePublishInput,
  AskFaqInput,
  AskFaqOutput,
} from ".";

/** abs("/faq") → https://.../api/faq */
async function abs(path: string): Promise<string> {
  const base = await getServerApiBaseAbsolute(); // "https://.../api"
  return base.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}

/* ======================= PUBLIC ======================= */

/** SSR/RSC: GET /faq — public list */
export async function fetchFaqListServer(
  params: FaqListParams = {},
  cookie?: string
): Promise<IFaq[]> {
  const url = new URL(await abs("faq"));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.sort) url.searchParams.set("sort", params.sort);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.category) url.searchParams.set("category", params.category);
  if (typeof params.isPublished === "boolean") {
    url.searchParams.set("isPublished", String(params.isPublished));
  }

  const tenant = await resolveTenant();
  const l = normalizeLocale(params.locale);

  const r = await fetch(url.toString(), {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    // public içerik: istiyorsan cache'leyebilirsin; default no-store bırakıyorum
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`faq list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IFaq[]> | IFaq[];
  return Array.isArray(j) ? j : (j.data ?? []);
}

/** SSR/RSC: GET /faq/:id — public tek kayıt */
export async function fetchFaqByIdServer(
  id: string,
  locale?: SupportedLocale,
  cookie?: string
): Promise<IFaq | null> {
  const url = await abs(`faq/${encodeURIComponent(id)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`faq by id failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IFaq> | IFaq;
  return (j as any)?.data ?? (j as IFaq);
}

/** SSR/RSC: POST /faq/ask — soru sor (AI/KB) */
export async function askFaqServer(
  input: AskFaqInput,
  cookie?: string
): Promise<AskFaqOutput> {
  const url = await abs("faq/ask");
  const tenant = await resolveTenant();
  const l = normalizeLocale(input.locale);

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify({ question: input.question }),
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`faq ask failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<AskFaqOutput> | AskFaqOutput;
  return ("data" in (j as any) ? (j as any).data : j) as AskFaqOutput;
}

/* ======================= ADMIN ======================= */
/** SSR/RSC: GET /faq/admin — admin list */
export async function fetchFaqAdminListServer(
  locale?: SupportedLocale,
  cookie?: string
): Promise<IFaq[]> {
  const url = await abs("faq/admin");
  const tenant = await resolveTenant();
  const l = normalizeLocale(locale);

  const r = await fetch(url, {
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`faq admin list failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IFaq[]> | IFaq[];
  return Array.isArray(j) ? j : (j.data ?? []);
}

/** SSR/RSC: POST /faq/admin — create */
export async function createFaqServer(
  input: CreateFaqInput,
  cookie?: string
): Promise<IFaq> {
  const url = await abs("faq/admin");
  const tenant = await resolveTenant();
  const l = normalizeLocale(input.locale);

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(input.payload),
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`faq create failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IFaq> | IFaq;
  return (j as any)?.data ?? (j as IFaq);
}

/** SSR/RSC: PUT /faq/admin/:id — update */
export async function updateFaqServer(
  input: UpdateFaqInput,
  cookie?: string
): Promise<IFaq> {
  const url = await abs(`faq/admin/${encodeURIComponent(input.id)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(input.locale);

  const r = await fetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(input.payload),
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`faq update failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IFaq> | IFaq;
  return (j as any)?.data ?? (j as IFaq);
}

/** SSR/RSC: DELETE /faq/admin/:id — delete */
export async function deleteFaqServer(
  input: DeleteFaqInput,
  cookie?: string
): Promise<{ id: string; message?: string }> {
  const url = await abs(`faq/admin/${encodeURIComponent(input.id)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(input.locale);

  const r = await fetch(url, {
    method: "DELETE",
    headers: {
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`faq delete failed: ${r.status}`);
  let message: string | undefined;
  try {
    const j = (await r.json()) as ApiEnvelope<any> | { message?: string };
    message = (j as any)?.message;
  } catch { }
  return { id: input.id, message };
}

/** SSR/RSC: PUT /faq/admin/:id { isPublished } — toggle publish */
export async function togglePublishFaqServer(
  input: TogglePublishInput,
  cookie?: string
): Promise<IFaq> {
  const url = await abs(`faq/admin/${encodeURIComponent(input.id)}`);
  const tenant = await resolveTenant();
  const l = normalizeLocale(input.locale);

  const r = await fetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      ...buildCommonHeaders(l, tenant),
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify({ isPublished: input.isPublished }),
    credentials: "include",
    cache: "no-store",
  });

  if (!r.ok) throw new Error(`faq toggle publish failed: ${r.status}`);
  const j = (await r.json()) as ApiEnvelope<IFaq> | IFaq;
  return (j as any)?.data ?? (j as IFaq);
}
