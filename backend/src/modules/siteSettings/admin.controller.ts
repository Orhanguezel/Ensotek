// =============================================================
// FILE: src/modules/siteSettings/admin.controller.ts
// Ensotek – SiteSettings Admin Controller
// + SEO strict validation (Zod) for keys: seo, site_seo, site_meta_default
// =============================================================

import type { RouteHandler } from 'fastify';
import { randomUUID } from 'crypto';
import { db } from '@/db/client';
import { siteSettings } from './schema';
import { and, asc, desc, eq, inArray, like, ne, or } from 'drizzle-orm';
import { siteSettingUpsertSchema, siteSettingBulkUpsertSchema, type JsonLike } from './validation';
import { normalizeLocale } from '@/core/i18n';

import {
  getAppLocales as getAppLocalesFromService,
  getDefaultLocale as getDefaultLocaleFromService,
  buildLocaleFallbackChain,
  PREFERRED_FALLBACK_LOCALE,
  getAppLocalesMeta,
  getEffectiveDefaultLocale,
} from '@/modules/siteSettings/service';

import { coerceLocaleByKey, normalizeValueByKey } from './settingPolicy';

type LocaleCode = string;

const isNonEmptyString = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;

function parseDbValue(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}

function stringifyValue(v: JsonLike): string {
  return JSON.stringify(v);
}

function rowToDto(r: typeof siteSettings.$inferSelect) {
  return {
    id: r.id,
    key: r.key,
    locale: r.locale,
    value: parseDbValue(r.value),
    created_at: r.created_at ? new Date(r.created_at).toISOString() : undefined,
    updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : undefined,
  };
}

function normalizeLooseLocale(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  if (!s) return null;
  if (s === '*') return '*';
  return normalizeLocale(s) || s.toLowerCase();
}

async function getAppLocales(): Promise<LocaleCode[]> {
  const list = await getAppLocalesFromService(null);
  return list?.length ? list : ['tr'];
}

async function getDefaultLocale(): Promise<LocaleCode> {
  const v = normalizeLooseLocale(await getDefaultLocaleFromService(null));
  return v && v !== '*' ? v : 'tr';
}

async function upsertOne(key: string, locale: LocaleCode, value: JsonLike) {
  const k = String(key || '').trim();
  const coercedLocale = (coerceLocaleByKey(k, locale) ?? locale) as LocaleCode;

  // ✅ value policy (strict validate + normalize)
  const normalizedValue = normalizeValueByKey(k, value);

  const now = new Date();
  await db
    .insert(siteSettings)
    .values({
      id: randomUUID(),
      key: k,
      locale: coercedLocale,
      value: stringifyValue(normalizedValue as JsonLike),
      created_at: now,
      updated_at: now,
    })
    .onDuplicateKeyUpdate({
      set: { value: stringifyValue(normalizedValue as JsonLike), updated_at: now },
    });
}

async function upsertAllLocales(key: string, value: JsonLike) {
  const appLocales = await getAppLocales();
  for (const l of appLocales) {
    await upsertOne(key, l, value);
  }
}

function isLocaleMap(
  v: unknown,
  allowedLocales: LocaleCode[],
): v is Partial<Record<LocaleCode, JsonLike>> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  const keys = Object.keys(o);
  if (!keys.length) return false;

  const allowed = new Set(allowedLocales.map((x) => normalizeLooseLocale(x) || x));
  return keys.every((k) => allowed.has(normalizeLooseLocale(k) || k));
}

async function getFirstByFallback(key: string, fallbacks: LocaleCode[]) {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(and(eq(siteSettings.key, key), inArray(siteSettings.locale, fallbacks)))
    .orderBy(asc(siteSettings.key));

  const byLocale = new Map(rows.map((r) => [r.locale, r]));
  for (const l of fallbacks) {
    const r = byLocale.get(l);
    if (r) return rowToDto(r).value;
  }
  return undefined;
}

async function buildAdminFallbacks(requested?: string | null): Promise<LocaleCode[]> {
  const reqLoc = normalizeLooseLocale(requested);

  const chain = await buildLocaleFallbackChain({
    requested: reqLoc,
    preferred: PREFERRED_FALLBACK_LOCALE,
  });

  return chain.filter(isNonEmptyString);
}

/* ---------- Aggregate GET/PUT ---------- */

export const adminGetSettingsAggregate: RouteHandler = async (req, reply) => {
  const qLocale = (req.query as any)?.locale as string | undefined;
  const fallbacks = await buildAdminFallbacks(qLocale ?? (req as any).locale);

  const keys = ['contact_info', 'socials', 'businessHours'] as const;

  const [contact_info, socials, businessHours] = await Promise.all(
    keys.map((k) => getFirstByFallback(k, fallbacks)),
  );

  return reply.send({
    contact_info: contact_info ?? {},
    socials: socials ?? {},
    businessHours: businessHours ?? [],
  });
};

export const adminUpsertSettingsAggregate: RouteHandler = async (req, reply) => {
  const body = (req.body || {}) as Partial<
    Record<'contact_info' | 'socials' | 'businessHours', JsonLike>
  >;

  const qLocale = (req.query as any)?.locale as string | undefined;
  const localeParam = normalizeLooseLocale(qLocale);

  const entries = Object.entries(body).filter(([, v]) => v !== undefined) as [string, JsonLike][];

  const appLocales = await getAppLocales();
  const def = await getDefaultLocale();

  for (const [key, value] of entries) {
    const effectiveLocale = localeParam && localeParam !== '*' ? localeParam : null;

    if (effectiveLocale) {
      if (isLocaleMap(value, appLocales)) {
        const val = (value as any)[effectiveLocale] ?? (value as any)[def];
        if (val !== undefined) await upsertOne(key, effectiveLocale, val as JsonLike);
      } else {
        await upsertOne(key, effectiveLocale, value);
      }
    } else {
      if (isLocaleMap(value, appLocales)) {
        for (const l of appLocales) {
          const val = (value as any)[l] ?? (value as any)[def] ?? value;
          await upsertOne(key, l, val as JsonLike);
        }
      } else {
        await upsertAllLocales(key, value);
      }
    }
  }

  return reply.send({ ok: true });
};

/* ---------- granular uçlar ---------- */

export const adminListSiteSettings: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as {
    q?: string;
    keys?: string;
    prefix?: string;
    order?: string;
    limit?: string | number;
    offset?: string | number;
    locale?: string;
  };

  const requested = normalizeLooseLocale(q.locale);

  const def = await getDefaultLocale();
  const localeToUse = requested ?? def;

  const GLOBAL_KEYS = new Set<string>(['app_locales', 'default_locale']);

  let qb = db.select().from(siteSettings).$dynamic();
  const conds: any[] = [];

  let keysArr: string[] | null = null;
  if (q.keys) {
    keysArr = q.keys
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (keysArr.length) conds.push(inArray(siteSettings.key, keysArr));
  }

  if (q.prefix) conds.push(like(siteSettings.key, `${q.prefix}%`));
  if (q.q) conds.push(like(siteSettings.key, `%${q.q}%`));

  if (localeToUse === '*') {
    conds.push(eq(siteSettings.locale, '*'));
  } else {
    if (keysArr?.length) {
      const globalRequested = keysArr.filter((k) => GLOBAL_KEYS.has(k));
      const normalRequested = keysArr.filter((k) => !GLOBAL_KEYS.has(k));

      if (globalRequested.length && !normalRequested.length) {
        conds.push(eq(siteSettings.locale, '*'));
      } else if (!globalRequested.length && normalRequested.length) {
        conds.push(eq(siteSettings.locale, localeToUse));
      } else if (globalRequested.length && normalRequested.length) {
        conds.push(
          or(
            and(eq(siteSettings.locale, '*'), inArray(siteSettings.key, globalRequested)),
            and(eq(siteSettings.locale, localeToUse), inArray(siteSettings.key, normalRequested)),
          ),
        );
      } else {
        conds.push(eq(siteSettings.locale, localeToUse));
      }
    } else {
      conds.push(eq(siteSettings.locale, localeToUse));
    }
  }

  qb = conds.length === 1 ? qb.where(conds[0]) : qb.where(and(...conds));

  if (q.order) {
    const [col, dir] = q.order.split('.');
    const colRef = (siteSettings as any)[col];
    qb = colRef
      ? qb.orderBy(dir === 'desc' ? desc(colRef) : asc(colRef))
      : qb.orderBy(asc(siteSettings.key));
  } else {
    qb = qb.orderBy(asc(siteSettings.key));
  }

  if (q.limit != null && q.limit !== '') {
    const n = Number(q.limit);
    if (!Number.isNaN(n) && n > 0) qb = qb.limit(n);
  }

  if (q.offset != null && q.offset !== '') {
    const m = Number(q.offset);
    if (!Number.isNaN(m) && m >= 0) qb = qb.offset(m);
  }

  const rows = await qb;
  return reply.send(rows.map(rowToDto));
};

export const adminGetSiteSettingByKey: RouteHandler = async (req, reply) => {
  const { key } = req.params as { key: string };
  const qLocale = (req.query as any)?.locale as string | undefined;

  const fallbacks = await buildAdminFallbacks(qLocale ?? (req as any).locale);
  const val = await getFirstByFallback(key, fallbacks);

  if (val === undefined) {
    return reply.code(404).send({ error: { message: 'not_found' } });
  }

  return reply.send({ key, value: val, locale: fallbacks[0] });
};

export const adminCreateSiteSetting: RouteHandler = async (req, reply) => {
  const input = siteSettingUpsertSchema.parse(req.body || {});
  await upsertAllLocales(input.key, input.value);

  const def = await getDefaultLocale();
  const rows = await db
    .select()
    .from(siteSettings)
    .where(and(eq(siteSettings.key, input.key), eq(siteSettings.locale, def)))
    .limit(1);

  return reply
    .code(201)
    .send(rows[0] ? rowToDto(rows[0]) : { key: input.key, locale: def, value: input.value });
};

export const adminUpdateSiteSetting: RouteHandler = async (req, reply) => {
  const { key } = req.params as { key: string };
  const body = (req.body || {}) as Partial<{ value: JsonLike }>;
  const qLocale = (req.query as any)?.locale as string | undefined;

  if (!('value' in body)) {
    return reply.code(400).send({ error: { message: 'validation_error' } });
  }

  const loc = normalizeLooseLocale(qLocale);

  // locale policy:
  // - global update if loc='*'
  // - if loc is valid locale => write only that locale
  // - else => write all locales
  if (loc === '*') {
    await upsertOne(key, '*', body.value as JsonLike);
    return reply.send({ ok: true });
  }

  const appLocales = await getAppLocales();
  if (loc && appLocales.includes(loc)) {
    await upsertOne(key, loc, body.value as JsonLike);
  } else {
    await upsertAllLocales(key, body.value as JsonLike);
  }

  return reply.send({ ok: true });
};

export const adminBulkUpsertSiteSettings: RouteHandler = async (req, reply) => {
  const input = siteSettingBulkUpsertSchema.parse(req.body || {});
  const appLocales = await getAppLocales();
  const def = await getDefaultLocale();

  for (const item of input.items) {
    if (isLocaleMap(item.value, appLocales)) {
      for (const l of appLocales) {
        const val = (item.value as any)[l] ?? (item.value as any)[def] ?? item.value;
        await upsertOne(item.key, l, val as JsonLike);
      }
    } else {
      await upsertAllLocales(item.key, item.value);
    }
  }

  return reply.send({ ok: true });
};

export const adminDeleteManySiteSettings: RouteHandler = async (req, reply) => {
  const q = (req.query || {}) as Record<string, string | undefined>;
  const conds: any[] = [];

  const idNe = q['id!'] ?? q['id_ne'];
  const key = q['key'];
  const keyNe = q['key!'] ?? q['key_ne'];
  const keyIn = q['key_in'] ?? q['keys'];
  const prefix = q['prefix'];
  const locale = q['locale'];

  if (idNe) conds.push(ne(siteSettings.id, idNe));
  if (key) conds.push(eq(siteSettings.key, key));
  if (keyNe) conds.push(ne(siteSettings.key, keyNe));
  if (keyIn) {
    const arr = keyIn
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (arr.length) conds.push(inArray(siteSettings.key, arr));
  }
  if (prefix) conds.push(like(siteSettings.key, `${prefix}%`));
  if (locale) {
    const locNorm = normalizeLooseLocale(locale);
    if (locNorm) conds.push(eq(siteSettings.locale, locNorm));
  }

  let d = db.delete(siteSettings).$dynamic();
  if (conds.length === 1) d = d.where(conds[0]);
  else if (conds.length > 1) d = d.where(and(...conds));

  await d;
  return reply.code(204).send();
};

export const adminDeleteSiteSetting: RouteHandler = async (req, reply) => {
  const { key } = req.params as { key: string };
  const qLocale = (req.query as any)?.locale as string | undefined;

  const locNorm = normalizeLooseLocale(qLocale);

  if (locNorm) {
    await db
      .delete(siteSettings)
      .where(and(eq(siteSettings.key, key), eq(siteSettings.locale, locNorm)));
  } else {
    await db.delete(siteSettings).where(eq(siteSettings.key, key));
  }

  return reply.code(204).send();
};

export const adminGetAppLocales: RouteHandler = async (_req, reply) => {
  const metas = await getAppLocalesMeta();
  return reply.send(metas);
};

export const adminGetDefaultLocale: RouteHandler = async (_req, reply) => {
  const def = await getEffectiveDefaultLocale();
  return reply.send(def);
};
