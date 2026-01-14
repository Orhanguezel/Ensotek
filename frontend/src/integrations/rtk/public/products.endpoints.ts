// =============================================================
// FILE: src/integrations/rtk/endpoints/products.endpoints.ts
// Public Products + FAQ + Specs + Reviews
// FIX: getProductBySlug => 404 fallback chain (locale -> no-locale -> en -> tr)
// - ✅ NO unused vars (_drop yok)
// - ✅ Params serialize helper (References konsepti)
// - ✅ 404 dışında fallback yok
// =============================================================

import { baseApi } from '@/integrations/rtk/baseApi';
import type {
  ProductDto,
  ProductListQueryParams,
  ProductListResponse,
  GetProductByIdOrSlugParams,
  GetProductBySlugParams,
  GetProductByIdParams,
  ProductFaqDto,
  ProductFaqListQueryParams,
  ProductSpecDto,
  ProductSpecListQueryParams,
  ProductReviewDto,
  ProductReviewListQueryParams,
} from '@/integrations/types';

/* ---------------- Helpers ---------------- */

type BaseQueryError = { status?: number; data?: any };

const safeStr = (v: unknown) => (v == null ? '' : String(v).trim());

const serializeProductListQuery = (q?: ProductListQueryParams): Record<string, any> => {
  if (!q) return {};
  const params: Record<string, any> = {};

  if (q.order) params.order = q.order;
  if (q.sort) params.sort = q.sort;
  if (q.orderDir) params.orderDir = q.orderDir;

  if (typeof q.limit === 'number') params.limit = q.limit;
  if (typeof q.offset === 'number') params.offset = q.offset;

  if (typeof q.only_active !== 'undefined') params.only_active = q.only_active;

  if (q.q) params.q = q.q;
  if (q.slug) params.slug = q.slug;

  if (q.category_id) params.category_id = q.category_id;
  if (q.sub_category_id) params.sub_category_id = q.sub_category_id;

  if (q.item_type) params.item_type = q.item_type;
  if (q.locale) params.locale = q.locale;

  return params;
};

const serializeDetailQuery = (q?: Record<string, any>): Record<string, any> | undefined => {
  const p = q ?? {};
  const out: Record<string, any> = {};

  // sadece anlamlı paramları taşı
  if (p.locale) out.locale = p.locale;
  if (p.item_type) out.item_type = p.item_type;

  // genişlemeye açık (ama boş göndermeyelim)
  for (const k of Object.keys(p)) {
    if (k === 'locale' || k === 'item_type') continue;
    const v = (p as any)[k];
    if (typeof v === 'undefined') continue;
    out[k] = v;
  }

  return Object.keys(out).length ? out : undefined;
};

const withoutLocale = (p?: Record<string, any>): Record<string, any> => {
  const src = p ?? {};
  // eslint/no-unused-vars tetiklemeden locale'i çıkar
  const { locale, ...rest } = src;
  void locale;
  return rest;
};

/* ---------------- API ---------------- */

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ---------- Products list ----------
    listProducts: build.query<ProductListResponse, ProductListQueryParams | void>({
      query: (params?: ProductListQueryParams) => ({
        url: '/products',
        method: 'GET',
        params: serializeProductListQuery(params),
      }),
      transformResponse: (response: ProductDto[], meta): ProductListResponse => {
        const header =
          (meta as any)?.response?.headers?.get('x-total-count') ??
          (meta as any)?.response?.headers?.get('X-Total-Count');

        const items = Array.isArray(response) ? response : [];
        const total = header ? Number(header) || items.length : items.length;
        return { items, total };
      },
      providesTags: (result) =>
        result?.items?.length
          ? [
              { type: 'Products' as const, id: 'LIST' },
              ...result.items.map((p) => ({ type: 'Products' as const, id: p.id })),
            ]
          : [{ type: 'Products' as const, id: 'LIST' }],
    }),

    // ---------- Detail (id veya slug) ----------
    getProductByIdOrSlug: build.query<ProductDto, GetProductByIdOrSlugParams>({
      query: ({ idOrSlug, ...params }) => ({
        url: `/products/${encodeURIComponent(idOrSlug)}`,
        method: 'GET',
        params: serializeDetailQuery(params as any),
      }),
      providesTags: (_res, _err, arg) => {
        void _err;
        return [{ type: 'Products' as const, id: arg.idOrSlug }];
      },
    }),

    // ---------- Detail (slug) + 404 fallback chain ----------
    getProductBySlug: build.query<ProductDto, GetProductBySlugParams & { item_type?: any }>({
      async queryFn(arg, _api, _extraOptions, baseQuery) {
        const slug = safeStr((arg as any)?.slug);
        const url = `/products/by-slug/${encodeURIComponent(slug)}`;

        // p0: gelen paramlar (locale + item_type + ...)
        const p0 = serializeDetailQuery({ ...(arg as any) }) ?? {};
        delete (p0 as any).slug; // slug query param değil, URL parçası

        const doReq = async (p: Record<string, any>) => {
          return (await baseQuery({
            url,
            method: 'GET',
            params: serializeDetailQuery(p),
          })) as { data?: any; error?: BaseQueryError };
        };

        // 1) Primary (requested locale)
        const r1 = await doReq(p0);
        if (!r1.error) return { data: r1.data as ProductDto };

        const status1 = Number((r1.error as any)?.status ?? 0);
        if (status1 !== 404) return { error: r1.error as any };

        const locale = safeStr((p0 as any)?.locale);

        // 2) Retry without locale
        if (locale) {
          const r2 = await doReq(withoutLocale(p0));
          if (!r2.error) return { data: r2.data as ProductDto };

          const status2 = Number((r2.error as any)?.status ?? 0);
          if (status2 !== 404) return { error: r2.error as any };
        }

        // 3) Retry with fallback locales: en -> tr (skip current)
        const candidates = ['en', 'tr'].filter((x) => x && x !== locale);

        for (const fb of candidates) {
          const r = await doReq({ ...p0, locale: fb });
          if (!r.error) return { data: r.data as ProductDto };

          const st = Number((r.error as any)?.status ?? 0);
          if (st !== 404) return { error: r.error as any };
        }

        // 4) Give original 404
        return { error: r1.error as any };
      },

      providesTags: (_res, _err, arg) => {
        void _err;
        return [{ type: 'Products' as const, id: `slug:${(arg as any)?.slug}` }];
      },
    }),

    getProductById: build.query<ProductDto, GetProductByIdParams>({
      query: ({ id, ...params }) => ({
        url: `/products/id/${encodeURIComponent(id)}`,
        method: 'GET',
        params: serializeDetailQuery(params as any),
      }),
      providesTags: (_res, _err, arg) => {
        void _err;
        return [{ type: 'Products' as const, id: arg.id }];
      },
    }),

    // ---------- Public FAQ ----------
    listProductFaqs: build.query<ProductFaqDto[], ProductFaqListQueryParams | void>({
      query: (params?: ProductFaqListQueryParams) => ({
        url: '/product_faqs',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.length
          ? [
              { type: 'ProductFaqs' as const, id: 'LIST' },
              ...result.map((f) => ({ type: 'ProductFaqs' as const, id: f.id })),
            ]
          : [{ type: 'ProductFaqs' as const, id: 'LIST' }],
    }),

    // ---------- Public Specs ----------
    listProductSpecs: build.query<ProductSpecDto[], ProductSpecListQueryParams | void>({
      query: (params?: ProductSpecListQueryParams) => ({
        url: '/product_specs',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.length
          ? [
              { type: 'ProductSpecs' as const, id: 'LIST' },
              ...result.map((s) => ({ type: 'ProductSpecs' as const, id: s.id })),
            ]
          : [{ type: 'ProductSpecs' as const, id: 'LIST' }],
    }),

    // ---------- Public Reviews ----------
    listProductReviews: build.query<ProductReviewDto[], ProductReviewListQueryParams>({
      query: (params) => ({
        url: '/product_reviews',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result?.length
          ? [
              { type: 'ProductReviews' as const, id: 'LIST' },
              ...result.map((r) => ({ type: 'ProductReviews' as const, id: r.id })),
            ]
          : [{ type: 'ProductReviews' as const, id: 'LIST' }],
    }),
  }),
  // Dev HMR'da injectEndpoints uyarısı istemiyorsan true yapabilirsin,
  // ama burada konsepti bozmayalım: tek inject noktası olması ideal.
  overrideExisting: false,
});

export const {
  useListProductsQuery,
  useGetProductByIdOrSlugQuery,
  useGetProductBySlugQuery,
  useGetProductByIdQuery,
  useListProductFaqsQuery,
  useListProductSpecsQuery,
  useListProductReviewsQuery,
} = productsApi;
