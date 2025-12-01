// =============================================================
// FILE: src/integrations/rtk/endpoints/sliders.endpoints.ts
// Ensotek – PUBLIC Slider RTK endpoints
// =============================================================

import { baseApi } from "../baseApi";

import type {
  ApiSliderPublic,
  SliderPublicDto,
  SliderPublicListQueryParams,
  SliderPublicDetailQuery,
} from "../../types/slider.types";
import { normalizeSliderPublic } from "../../types/slider.types";

export const slidersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* --------------------------------------------------------- */
    /*  PUBLIC: Liste                                            */
    /*  GET /sliders                                             */
    /*  (Sadece aktifler, locale filtresi backend'de)            */
    /* --------------------------------------------------------- */
    listSliders: build.query<
      SliderPublicDto[],
      SliderPublicListQueryParams | void
    >({
      query: (params) => {
        const queryParams: Record<string, any> | undefined = params
          ? (params as Record<string, any>)
          : undefined;

        return {
          url: "/sliders",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: ApiSliderPublic[]) =>
        Array.isArray(response)
          ? response.map(normalizeSliderPublic)
          : [],
      providesTags: (result) =>
        result && result.length
          ? [
              ...result.map((r) => ({
                type: "Sliders" as const,
                id: r.id,
              })),
              { type: "Sliders" as const, id: "LIST_PUBLIC" },
            ]
          : [{ type: "Sliders" as const, id: "LIST_PUBLIC" }],
    }),

    /* --------------------------------------------------------- */
    /*  PUBLIC: Tekil (slug + locale)                            */
    /*  GET /sliders/:slug?locale=...                            */
    /* --------------------------------------------------------- */
    getSliderPublic: build.query<
      SliderPublicDto,
      SliderPublicDetailQuery
    >({
      query: ({ slug, locale }) => {
        const queryParams: Record<string, any> | undefined = locale
          ? { locale }
          : undefined;

        return {
          url: `/sliders/${slug}`,
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: ApiSliderPublic) =>
        normalizeSliderPublic(response),
      providesTags: (res) =>
        res
          ? [{ type: "Sliders" as const, id: res.id }]
          : [{ type: "Sliders" as const, id: "DETAIL_PUBLIC" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListSlidersQuery,
  useGetSliderPublicQuery,
} = slidersApi;
