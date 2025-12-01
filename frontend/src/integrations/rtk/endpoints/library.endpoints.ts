// =============================================================
// FILE: src/integrations/rtk/endpoints/library.endpoints.ts
// Ensotek – Public Library RTK Endpoints
// =============================================================

import { baseApi } from "../baseApi";
import type {
  LibraryDto,
  LibraryPublicListQueryParams,
  LibraryImageDto,
  LibraryFileDto,
} from "@/integrations/types/library.types";

type WithLocale<T> = T & { locale?: string };

const cleanParams = (
  params?: Record<string, unknown>,
): Record<string, unknown> | undefined => {
  if (!params) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
};

export const libraryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* --------------------------------------------------------- */
    /* LIST – GET /library                                       */
    /* --------------------------------------------------------- */
    listLibrary: build.query<
      LibraryDto[],
      WithLocale<LibraryPublicListQueryParams> | void
    >({
      query: (params) => {
        const p = (params || {}) as WithLocale<LibraryPublicListQueryParams>;
        const { locale, ...rest } = p;

        return {
          url: "/library",
          method: "GET",
          // locale’i de query’ye ekliyoruz → i18n plugin’i kullanabiliyorsa kullansın
          params: cleanParams({ ...rest, locale }),
          // ve aynı zamanda header olarak da gönderiyoruz
          headers: locale ? { "x-locale": locale } : undefined,
        };
      },
    }),

    /* --------------------------------------------------------- */
    /* GET BY ID – GET /library/:id                              */
    /* --------------------------------------------------------- */
    getLibraryById: build.query<LibraryDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/library/${id}`,
        method: "GET",
        params: cleanParams({ locale }),
        headers: locale ? { "x-locale": locale } : undefined,
      }),
    }),

    /* --------------------------------------------------------- */
    /* GET BY SLUG – GET /library/by-slug/:slug                  */
    /* --------------------------------------------------------- */
    getLibraryBySlug: build.query<
      LibraryDto,
      { slug: string; locale?: string }
    >({
      query: ({ slug, locale }) => ({
        url: `/library/by-slug/${encodeURIComponent(slug)}`,
        method: "GET",
        params: cleanParams({ locale }),
        headers: locale ? { "x-locale": locale } : undefined,
      }),
    }),

    /* --------------------------------------------------------- */
    /* LIST IMAGES – GET /library/:id/images                     */
    /* --------------------------------------------------------- */
    listLibraryImages: build.query<
      LibraryImageDto[],
      { id: string; locale?: string }
    >({
      query: ({ id, locale }) => ({
        url: `/library/${id}/images`,
        method: "GET",
        params: cleanParams({ locale }),
        headers: locale ? { "x-locale": locale } : undefined,
      }),
    }),

    /* --------------------------------------------------------- */
    /* LIST FILES – GET /library/:id/files                       */
    /* --------------------------------------------------------- */
    listLibraryFiles: build.query<
      LibraryFileDto[],
      { id: string; locale?: string }
    >({
      query: ({ id, locale }) => ({
        url: `/library/${id}/files`,
        method: "GET",
        params: cleanParams({ locale }),
        headers: locale ? { "x-locale": locale } : undefined,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useListLibraryQuery,
  useLazyListLibraryQuery,
  useGetLibraryByIdQuery,
  useLazyGetLibraryByIdQuery,
  useGetLibraryBySlugQuery,
  useLazyGetLibraryBySlugQuery,
  useListLibraryImagesQuery,
  useLazyListLibraryImagesQuery,
  useListLibraryFilesQuery,
  useLazyListLibraryFilesQuery,
} = libraryApi;
