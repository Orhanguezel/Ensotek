import { randomUUID } from 'crypto';
import { and, asc, desc, eq, gte, like, lte, or, type SQL } from 'drizzle-orm';
import { db } from '../../db/client';
import { siteSettings } from '../siteSettings';
import { leadCatalogDownloads, type CatalogRequestRow } from './schema';
import type { CreateCatalogRequestInput, ListCatalogRequestsInput, PatchCatalogRequestInput } from './validation';

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function resolveCatalogUrl(locale?: string | null): Promise<string> {
  const requested = (locale || 'tr').trim().toLowerCase();
  const candidates = [requested, requested.split('-')[0], 'tr', 'de', 'en', '*'].filter(Boolean);
  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, 'catalog_pdf'));
  const byLocale = new Map(rows.map((row) => [row.locale, row.value]));
  const raw = candidates.map((key) => byLocale.get(key)).find((value) => typeof value === 'string' && value.trim());
  if (!raw) return 'https://www.ensotek.de/uploads/ensotek/catalog/ensotek-katalog.pdf';
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'string' ? parsed : String(parsed?.url ?? parsed?.href ?? raw);
  } catch {
    return raw;
  }
}

export async function repoCreateCatalogRequest(
  body: CreateCatalogRequestInput & { ip?: string | null; user_agent?: string | null; catalog_url: string },
): Promise<CatalogRequestRow> {
  const id = randomUUID();
  await db.insert(leadCatalogDownloads).values({
    id,
    status: 'new',
    locale: body.locale || null,
    country_code: body.country_code?.toUpperCase() || null,
    customer_name: body.customer_name,
    company_name: body.company_name || null,
    email: body.email,
    phone: body.phone || null,
    message: body.message || null,
    catalog_url: body.catalog_url,
    consent_marketing: body.consent_marketing,
    consent_terms: body.consent_terms,
    ip: body.ip || null,
    user_agent: body.user_agent || null,
  });
  return (await repoGetCatalogRequest(id)) as CatalogRequestRow;
}

export async function repoGetCatalogRequest(id: string): Promise<CatalogRequestRow | null> {
  const [row] = await db.select().from(leadCatalogDownloads).where(eq(leadCatalogDownloads.id, id)).limit(1);
  return (row ?? null) as CatalogRequestRow | null;
}

export async function repoListCatalogRequests(params: ListCatalogRequestsInput): Promise<CatalogRequestRow[]> {
  const conditions: SQL<unknown>[] = [];
  if (params.status) conditions.push(eq(leadCatalogDownloads.status, params.status));
  if (params.locale) conditions.push(eq(leadCatalogDownloads.locale, params.locale));
  if (params.country_code) conditions.push(eq(leadCatalogDownloads.country_code, params.country_code.toUpperCase()));
  if (params.email) conditions.push(like(leadCatalogDownloads.email, `%${params.email}%`));
  if (params.q) {
    const needle = `%${params.q}%`;
    conditions.push(or(
      like(leadCatalogDownloads.customer_name, needle),
      like(leadCatalogDownloads.company_name, needle),
      like(leadCatalogDownloads.email, needle),
      like(leadCatalogDownloads.phone, needle),
    )!);
  }
  const from = parseDate(params.created_from);
  const to = parseDate(params.created_to);
  if (from) conditions.push(gte(leadCatalogDownloads.created_at, from));
  if (to) conditions.push(lte(leadCatalogDownloads.created_at, to));

  const orderDesc = params.order === 'created_at.asc' ? false : (params.orderDir ?? 'desc') === 'desc';
  const orderColumn = params.sort === 'updated_at' ? leadCatalogDownloads.updated_at : leadCatalogDownloads.created_at;
  const query = db.select().from(leadCatalogDownloads);
  const filtered = conditions.length ? query.where(and(...conditions)) : query;
  return filtered
    .orderBy(orderDesc ? desc(orderColumn) : asc(orderColumn))
    .limit(params.limit)
    .offset(params.offset) as Promise<CatalogRequestRow[]>;
}

export async function repoPatchCatalogRequest(id: string, body: PatchCatalogRequestInput): Promise<CatalogRequestRow | null> {
  const patch: Record<string, unknown> = { updated_at: new Date() };
  if (body.status !== undefined) patch.status = body.status;
  if (body.admin_notes !== undefined) patch.admin_notes = body.admin_notes;
  await db.update(leadCatalogDownloads).set(patch).where(eq(leadCatalogDownloads.id, id));
  return repoGetCatalogRequest(id);
}

export async function repoMarkCatalogEmailSent(id: string): Promise<CatalogRequestRow | null> {
  await db.update(leadCatalogDownloads).set({
    status: 'sent',
    email_sent_at: new Date(),
    updated_at: new Date(),
  }).where(eq(leadCatalogDownloads.id, id));
  return repoGetCatalogRequest(id);
}

export async function repoMarkCatalogEmailFailed(id: string): Promise<CatalogRequestRow | null> {
  await db.update(leadCatalogDownloads).set({
    status: 'failed',
    updated_at: new Date(),
  }).where(eq(leadCatalogDownloads.id, id));
  return repoGetCatalogRequest(id);
}

export async function repoDeleteCatalogRequest(id: string): Promise<boolean> {
  const res = await db.delete(leadCatalogDownloads).where(eq(leadCatalogDownloads.id, id)).execute();
  return Number((res as { affectedRows?: unknown } | undefined)?.affectedRows ?? 0) > 0;
}
