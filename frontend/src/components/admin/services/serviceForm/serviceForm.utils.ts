// =============================================================
// FILE: src/components/admin/services/serviceForm/serviceForm.utils.ts
// Ensotek – ServiceForm helpers (normalize/build)
// =============================================================

import type { ServiceDto,ServiceFormValues } from '@/integrations/types';

export const normalizeLocale = (v: unknown): string => {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
  return s;
};

export const slugify = (value: string): string => {
  if (!value) return '';

  let s = value.trim();

  const trMap: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    I: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  };

  s = s
    .split('')
    .map((ch) => trMap[ch] ?? ch)
    .join('');

  s = s.replace(/ß/g, 'ss').replace(/ẞ/g, 'ss');

  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const resolveInitialLocale = (
  initial: ServiceDto | undefined,
  activeLocale: string | undefined,
  fallbackLocale: string,
): string => {
  const candidate = normalizeLocale(
    initial?.locale_resolved ?? activeLocale ?? fallbackLocale ?? '',
  );
  return candidate || fallbackLocale;
};

const toStr = (v: unknown) => (v === null || v === undefined ? '' : String(v));

export const buildInitialValues = (
  initial: ServiceDto | undefined,
  activeLocale: string | undefined,
  fallbackLocale: string,
): ServiceFormValues => {
  const loc = resolveInitialLocale(initial, activeLocale, fallbackLocale);

  if (!initial) {
    return {
      id: undefined,
      locale: loc,

      name: '',
      slug: '',
      description: '',

      material: '',
      price: '',
      includes: '',
      warranty: '',
      image_alt: '',

      category_id: '',
      sub_category_id: '',

      is_active: true,
      featured: false,
      display_order: '1',

      featured_image: '',
      image_url: '',
      image_asset_id: '',

      area: '',
      duration: '',
      maintenance: '',
      season: '',
      equipment: '',

      // ✅ SEO + tags (yeni alanlar – boş string)
      tags: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',

      replicate_all_locales: true,
      apply_all_locales: false,
    };
  }

  return {
    id: initial.id,
    locale: loc,

    name: toStr(initial.name),
    slug: toStr(initial.slug),
    description: toStr(initial.description),

    material: toStr(initial.material),
    price: toStr(initial.price),
    includes: toStr(initial.includes),
    warranty: toStr(initial.warranty),
    image_alt: toStr(initial.image_alt),

    category_id: toStr(initial.category_id),
    sub_category_id: toStr(initial.sub_category_id),

    is_active: !!initial.is_active,
    featured: !!initial.featured,
    display_order: Number.isFinite(initial.display_order) ? String(initial.display_order) : '1',

    // ✅ NULL -> '' normalizasyonu (preview fix)
    featured_image: toStr(initial.featured_image),
    image_url: toStr(initial.image_url),
    image_asset_id: toStr(initial.image_asset_id),

    area: toStr(initial.area),
    duration: toStr(initial.duration),
    maintenance: toStr(initial.maintenance),
    season: toStr(initial.season),
    equipment: toStr(initial.equipment),

    // ✅ SEO + tags – mevcut kayıttan oku, yoksa ''
    tags: toStr((initial as any).tags),
    meta_title: toStr((initial as any).meta_title),
    meta_description: toStr((initial as any).meta_description),
    meta_keywords: toStr((initial as any).meta_keywords),

    replicate_all_locales: true,
    apply_all_locales: false,
  };
};
