// =============================================================
// FILE: src/integrations/types/slider.types.ts
// Ensotek – Slider tipleri + normalizer'lar
// =============================================================

/* -------------------- Helper'lar -------------------- */

const asStr = (v: unknown): string =>
  typeof v === "string" ? v : String(v ?? "");

const asBool = (v: unknown): boolean =>
  v === true || v === 1 || v === "1" || v === "true";

const asNum = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* -------------------- API tipleri (RAW) -------------------- */

/**
 * Admin controller'ın döndürdüğü şekil
 * toAdminView() ile oluşan obje
 */
export interface ApiSliderAdmin {
  id: number;
  uuid: string;
  locale: string;
  name: string;
  slug: string;
  description: string | null;

  image_url: string | null;
  image_asset_id: string | null;
  image_effective_url: string | null;

  alt: string | null;
  buttonText: string | null;
  buttonLink: string | null;

  featured: boolean;
  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

/**
 * Public controller'daki SlideData tipi
 * rowToPublic() ile dönen obje
 */
export interface ApiSliderPublic {
  id: string;
  title: string;
  description: string;
  image: string;
  alt?: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  priority?: "low" | "medium" | "high";
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
  locale: string;
}

/* -------------------- FE DTO tipleri -------------------- */

/**
 * Admin tarafında kullanılacak normalize DTO
 * (id'yi string'e çeviriyoruz, diğer alanlar korunuyor)
 */
export interface SliderAdminDto {
  id: string;
  uuid: string;
  locale: string;
  name: string;
  slug: string;
  description: string | null;

  image_url: string | null;
  image_asset_id: string | null;
  image_effective_url: string | null;

  alt: string | null;
  buttonText: string | null;
  buttonLink: string | null;

  featured: boolean;
  is_active: boolean;
  display_order: number;

  created_at: string;
  updated_at: string;
}

/**
 * Public tarafında (Hero slider vs) kullanılacak DTO
 * API ile neredeyse aynı, sadece type safety için normalize ediyoruz.
 */
export interface SliderPublicDto {
  id: string;
  title: string;
  description: string;
  image: string;
  alt?: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  priority?: "low" | "medium" | "high";
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
  locale: string;
}

/* -------------------- Query param tipleri -------------------- */

export type SliderSortField =
  | "display_order"
  | "name"
  | "created_at"
  | "updated_at";

export type SliderSortOrder = "asc" | "desc";

/**
 * Admin list query (adminListQuerySchema ile uyumlu)
 */
export interface SliderAdminListQueryParams {
  q?: string;
  locale?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  sort?: SliderSortField;
  order?: SliderSortOrder;
}

/**
 * Public list query (publicListQuerySchema ile uyumlu)
 */
export interface SliderPublicListQueryParams {
  locale?: string;
  q?: string;
  limit?: number;
  offset?: number;
  sort?: SliderSortField;
  order?: SliderSortOrder;
}

/**
 * Public detail – slug + locale
 * GET /sliders/:slug?locale=tr
 */
export interface SliderPublicDetailQuery {
  slug: string;
  locale?: string;
}

/* -------------------- Create / Update payload'ları -------------------- */

/**
 * CreateBody (createSchema) ile uyumlu payload
 */
export interface SliderCreatePayload {
  locale?: string;

  name: string;
  slug?: string;
  description?: string | null;

  image_url?: string | null;
  image_asset_id?: string | null;
  alt?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;

  featured?: boolean;
  is_active?: boolean;

  display_order?: number;
}

/**
 * UpdateBody (updateSchema.partial) ile uyumlu payload
 */
export interface SliderUpdatePayload {
  locale?: string;

  name?: string;
  slug?: string;
  description?: string | null;

  image_url?: string | null;
  image_asset_id?: string | null;
  alt?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;

  featured?: boolean;
  is_active?: boolean;

  display_order?: number;
}

/**
 * Reorder body – reorderSchema (ids: number[])
 */
export interface SliderReorderPayload {
  ids: number[];
}

/**
 * Status set – setStatusSchema
 */
export interface SliderSetStatusPayload {
  is_active: boolean;
}

/**
 * Image set – setImageSchema (asset_id null ise image temizlenir)
 */
export interface SliderSetImagePayload {
  asset_id: string | null;
}

/* -------------------- Normalizer'lar -------------------- */

export const normalizeSliderAdmin = (api: ApiSliderAdmin): SliderAdminDto => ({
  id: asStr(api.id),
  uuid: asStr(api.uuid),
  locale: asStr(api.locale || "tr"),
  name: asStr(api.name),
  slug: asStr(api.slug),
  description: api.description ?? null,

  image_url: api.image_url ?? null,
  image_asset_id: api.image_asset_id ?? null,
  image_effective_url: api.image_effective_url ?? api.image_url ?? null,

  alt: api.alt ?? null,
  buttonText: api.buttonText ?? null,
  buttonLink: api.buttonLink ?? null,

  featured: asBool(api.featured),
  is_active: asBool(api.is_active),
  display_order: asNum(api.display_order),

  created_at: asStr(api.created_at),
  updated_at: asStr(api.updated_at),
});

export const normalizeSliderPublic = (
  api: ApiSliderPublic,
): SliderPublicDto => ({
  id: asStr(api.id),
  title: asStr(api.title),
  description: asStr(api.description ?? ""),
  image: asStr(api.image ?? ""),
  alt: api.alt ?? undefined,
  buttonText: asStr(api.buttonText ?? "İncele"),
  buttonLink: asStr(api.buttonLink ?? ""),

  isActive: asBool(api.isActive),
  order: asNum(api.order),
  priority: api.priority,
  showOnMobile: api.showOnMobile,
  showOnDesktop: api.showOnDesktop,
  locale: asStr(api.locale || "tr"),
});
