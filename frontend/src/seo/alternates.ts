// =============================================================
// FILE: src/seo/alternates.ts
// =============================================================
import 'server-only';

import { fetchActiveLocales, getDefaultLocale } from '@/i18n/server';

import {
  absUrlJoin,
  DEFAULT_LOCALE_FALLBACK,
  getRuntimeBaseUrl,
  localizedPath,
  normLocaleShort,
  normPath,
  uniq,
} from '@/seo/helpers';

/** hreflang için mutlak URL haritası üretir (DB app_locales) */
export async function languagesMap(pathname?: string) {
  const baseUrl = await getRuntimeBaseUrl();

  const defaultLocaleRaw = await getDefaultLocale();
  const def = normLocaleShort(defaultLocaleRaw, DEFAULT_LOCALE_FALLBACK);

  const activeRaw = await fetchActiveLocales();
  const active = uniq(activeRaw.map((l) => normLocaleShort(l, def))).filter(Boolean);

  // default locale mutlaka listede olsun
  if (!active.includes(def)) active.unshift(def);

  const p = normPath(pathname);

  const map: Record<string, string> = {};
  for (const l of active) {
    map[l] = absUrlJoin(baseUrl, localizedPath(l, p, def));
  }

  // ✅ x-default: default locale canonical
  map['x-default'] = absUrlJoin(baseUrl, localizedPath(def, p, def));

  return map as Readonly<Record<string, string>>;
}

/** Canonical URL (mutlak) – seçilen dil için */
export async function canonicalFor(locale: string, pathname?: string) {
  const baseUrl = await getRuntimeBaseUrl();

  const defaultLocaleRaw = await getDefaultLocale();
  const def = normLocaleShort(defaultLocaleRaw, DEFAULT_LOCALE_FALLBACK);

  const p = normPath(pathname);
  const loc = normLocaleShort(locale, def);

  return absUrlJoin(baseUrl, localizedPath(loc, p, def));
}
