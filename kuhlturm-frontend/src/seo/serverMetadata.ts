// =============================================================
// FILE: src/seo/serverMetadata.ts
// Kühlturm — Server Metadata Builder (DB-driven locales/default)
//   - Active locales: site_settings.app_locales (DB)
//   - Default locale: getDefaultLocale() (DB)
//   - Canonical + hreflang SSR tek kaynak (alternates)
//   - GLOBAL defaults (locale='*') first-class
//   - NO hardcoded locale unions
// =============================================================
import 'server-only';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import {
  fetchSetting,
  fetchActiveLocales,
  getDefaultLocale,
  type JsonLike,
} from '@/i18n/server';

import {
  absUrlJoin,
  asBool,
  asObj,
  asStr,
  asStrArr,
  DEFAULT_LOCALE_FALLBACK,
  localizedPath,
  normLocaleShort,
  normPath,
  normalizeLocalhostOrigin,
  stripTrailingSlash,
  uniq,
} from '@/seo/helpers';

async function getRuntimeBaseUrl(): Promise<string> {
  const env = stripTrailingSlash(String(process.env.NEXT_PUBLIC_SITE_URL || '').trim());
  if (env) return normalizeLocalhostOrigin(env);

  const publicBase = await fetchSetting('public_base_url', '*', { revalidate: 600 });
  const fromDb = stripTrailingSlash(String((publicBase as { value?: string } | null)?.value || '').trim());
  if (fromDb && /^https?:\/\//i.test(fromDb)) return normalizeLocalhostOrigin(fromDb);

  const h = await headers();

  const xfProto = String(h.get('x-forwarded-proto') || '')
    .split(',')[0]
    ?.trim();
  const xfHost = String(h.get('x-forwarded-host') || '')
    .split(',')[0]
    ?.trim();

  const host = xfHost || String(h.get('host') || '').trim();
  const proto = (xfProto || 'https').trim();

  if (host) return normalizeLocalhostOrigin(stripTrailingSlash(`${proto}://${host}`));

  return 'http://localhost:3000';
}

function toOgLocale(l: string): string {
  const raw = String(l || '').trim();
  if (!raw) return `${DEFAULT_LOCALE_FALLBACK}_${DEFAULT_LOCALE_FALLBACK.toUpperCase()}`;

  const normalized = raw.replace('_', '-').toLowerCase();
  const [langRaw, regionRaw] = normalized.split('-');

  const lang = (langRaw || DEFAULT_LOCALE_FALLBACK).toLowerCase().slice(0, 2);
  const region = (regionRaw || '').toUpperCase();

  return `${lang}_${region || lang.toUpperCase()}`;
}

async function resolveActiveLocales(provided?: string[]) {
  const list = provided && provided.length ? provided : await fetchActiveLocales();
  const normalized = uniq(list.map((l) => normLocaleShort(l, DEFAULT_LOCALE_FALLBACK))).filter(Boolean);
  if (!normalized.length) normalized.push(DEFAULT_LOCALE_FALLBACK);
  return normalized;
}

function buildSeoLocaleTryOrder(args: {
  requestedLocale: string;
  defaultLocale: string;
  activeLocales: string[];
}): string[] {
  const req = normLocaleShort(args.requestedLocale, DEFAULT_LOCALE_FALLBACK);
  const def = normLocaleShort(args.defaultLocale, DEFAULT_LOCALE_FALLBACK);
  const act = uniq((args.activeLocales || []).map((l) => normLocaleShort(l, def))).filter(Boolean);
  return uniq([req, '*', def, ...act, DEFAULT_LOCALE_FALLBACK].filter(Boolean));
}

async function fetchSeoRowWithFallback(locale: string, providedActiveLocales?: string[]) {
  const loc = normLocaleShort(locale, DEFAULT_LOCALE_FALLBACK);
  const tryKeys = ['seo', 'site_seo'] as const;

  const defaultLocale = await getDefaultLocale();
  const activeLocales = await resolveActiveLocales(providedActiveLocales);

  const tryLocales = buildSeoLocaleTryOrder({
    requestedLocale: loc,
    defaultLocale,
    activeLocales,
  });

  for (const k of tryKeys) {
    for (const l of tryLocales) {
      const row = await fetchSetting(k, l, { revalidate: 600 });
      if (row?.value != null) return row;
    }
  }

  return null;
}

export async function fetchSeoObject(
  locale: string,
  providedActiveLocales?: string[],
): Promise<Record<string, unknown>> {
  const row = await fetchSeoRowWithFallback(locale, providedActiveLocales);
  const v = row?.value as JsonLike;
  const obj = asObj(v);
  return obj ?? {};
}

/* -------------------- Metadata builder -------------------- */

type BuildMetadataArgs = {
  locale: string;
  pathname?: string;
  activeLocales?: string[];
};

export async function buildMetadataFromSeo(
  seo: Record<string, unknown>,
  args: BuildMetadataArgs,
): Promise<Metadata> {
  const baseUrl = await getRuntimeBaseUrl();

  const active = await resolveActiveLocales(args.activeLocales);
  const defaultLocale = await getDefaultLocale();
  const locale = normLocaleShort(args.locale, DEFAULT_LOCALE_FALLBACK);

  const siteName = asStr(seo.site_name) || 'Kühlturm';
  const titleDefault = asStr(seo.title_default) || siteName;
  const titleTemplate = asStr(seo.title_template) || `%s | ${siteName}`;
  const rawDescription =
    asStr(seo.description) ||
    asStr(seo.description_default) ||
    asStr(seo.site_description) ||
    '';

  const description =
    rawDescription ||
    (locale === 'de'
      ? 'Leistungsstarke Kühltürme für Industrie und Gewerbe — zuverlässig, energieeffizient, maßgefertigt.'
      : locale === 'tr'
        ? 'Endüstri ve ticari kullanım için güçlü soğutma kuleleri — güvenilir, enerji verimli ve özel üretim.'
        : 'High-performance cooling towers for industry and commerce — reliable, energy-efficient, custom-built.');

  const og = asObj(seo.open_graph) || {};
  const ogType = (asStr(og.type) || 'website') as 'website' | 'article' | 'profile';

  const legacyOne = asStr(og?.image);
  const ogImages = uniq([...(legacyOne ? [legacyOne] : []), ...asStrArr(og?.images)])
    .map((u) => absUrlJoin(baseUrl, u))
    .filter(Boolean);

  const tw = asObj(seo.twitter) || {};
  const twitterCard = (asStr(tw.card) || 'summary_large_image') as 'summary' | 'summary_large_image' | 'app' | 'player';
  const twitterSite = asStr(tw.site);
  const twitterCreator = asStr(tw.creator);

  const rb = asObj(seo.robots) || {};
  const robotsNoindex = asBool(rb.noindex) ?? false;
  const robotsIndex = asBool(rb.index) ?? true;
  const robotsFollow = asBool(rb.follow) ?? true;

  const pathname = normPath(args.pathname);

  const canonical = absUrlJoin(baseUrl, localizedPath(locale, pathname, defaultLocale));

  const languages: Record<string, string> = {};
  for (const l of active) {
    languages[l] = absUrlJoin(baseUrl, localizedPath(l, pathname, defaultLocale));
  }
  languages['x-default'] = absUrlJoin(baseUrl, localizedPath(defaultLocale, pathname, defaultLocale));

  const ogLocale = toOgLocale(locale);
  const ogAltLocales = active
    .filter((l) => normLocaleShort(l, DEFAULT_LOCALE_FALLBACK) !== normLocaleShort(locale, DEFAULT_LOCALE_FALLBACK))
    .map((l) => toOgLocale(l));

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),

    title: { default: titleDefault, template: titleTemplate },
    ...(description ? { description } : {}),

    alternates: {
      canonical,
      languages,
    },

    openGraph: {
      type: ogType,
      siteName,
      url: canonical,
      title: titleDefault,
      ...(description ? { description } : {}),
      locale: ogLocale,
      ...(ogAltLocales.length ? { alternateLocale: ogAltLocales } : {}),
      ...(ogImages.length ? { images: ogImages.map((url) => ({ url })) } : {}),
    },

    twitter: {
      card: twitterCard,
      ...(twitterSite ? { site: twitterSite } : {}),
      ...(twitterCreator ? { creator: twitterCreator } : {}),
      ...(ogImages[0] ? { images: [ogImages[0]] } : {}),
    },

    robots: robotsNoindex
      ? { index: false, follow: false }
      : { index: robotsIndex, follow: robotsFollow },
  };

  return metadata;
}
