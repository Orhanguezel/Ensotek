// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/sliders_admin.endpoints.ts
// Ensotek – ADMIN Slider RTK endpoints
// =============================================================

import { baseApi } from "../../baseApi";

import type {
  ApiSliderAdmin,
  SliderAdminDto,
  SliderAdminListQueryParams,
  SliderCreatePayload,
  SliderUpdatePayload,
  SliderReorderPayload,
  SliderSetStatusPayload,
  SliderSetImagePayload,
} from "../../../types/slider.types";
import { normalizeSliderAdmin } from "../../../types/slider.types";

export const slidersAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /* --------------------------------------------------------- */
    /*  ADMIN: Liste                                              */
    /*  GET /admin/sliders                                        */
    /* --------------------------------------------------------- */
    listSlidersAdmin: build.query<SliderAdminDto[], SliderAdminListQueryParams | void>(
      {
        query: (params) => {
          const queryParams: Record<string, any> | undefined = params
            ? (params as Record<string, any>)
            : undefined;

          return {
            url: "/admin/sliders",
            method: "GET",
            params: queryParams,
          };
        },
        transformResponse: (response: ApiSliderAdmin[]) =>
          Array.isArray(response)
            ? response.map(normalizeSliderAdmin)
            : [],
        providesTags: (result) =>
          result && result.length
            ? [
                ...result.map((r) => ({
                  type: "Sliders" as const,
                  id: r.id,
                })),
                { type: "Sliders" as const, id: "LIST" },
              ]
            : [{ type: "Sliders" as const, id: "LIST" }],
      },
    ),

    /* --------------------------------------------------------- */
    /*  ADMIN: Tekil (ID)                                         */
    /*  GET /admin/sliders/:id                                    */
    /* --------------------------------------------------------- */
    getSliderAdmin: build.query<SliderAdminDto, number | string>({
      query: (id) => ({
        url: `/admin/sliders/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ApiSliderAdmin) =>
        normalizeSliderAdmin(response),
      providesTags: (_res, _err, id) => [
        { type: "Sliders" as const, id: String(id) },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: CREATE                                             */
    /*  POST /admin/sliders                                       */
    /* --------------------------------------------------------- */
    createSliderAdmin: build.mutation<
      SliderAdminDto,
      SliderCreatePayload
    >({
      query: (body) => ({
        url: "/admin/sliders",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSliderAdmin) =>
        normalizeSliderAdmin(response),
      invalidatesTags: [{ type: "Sliders" as const, id: "LIST" }],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: UPDATE (PATCH)                                     */
    /*  PATCH /admin/sliders/:id                                  */
    /* --------------------------------------------------------- */
    updateSliderAdmin: build.mutation<
      SliderAdminDto,
      { id: number | string; patch: SliderUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/sliders/${id}`,
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response: ApiSliderAdmin) =>
        normalizeSliderAdmin(response),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Sliders" as const, id: String(arg.id) },
        { type: "Sliders" as const, id: "LIST" },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: DELETE                                             */
    /*  DELETE /admin/sliders/:id                                 */
    /* --------------------------------------------------------- */
    deleteSliderAdmin: build.mutation<void, number | string>({
      query: (id) => ({
        url: `/admin/sliders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Sliders" as const, id: String(id) },
        { type: "Sliders" as const, id: "LIST" },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: REORDER                                            */
    /*  POST /admin/sliders/reorder                               */
    /* --------------------------------------------------------- */
    reorderSlidersAdmin: build.mutation<
      { ok: boolean },
      SliderReorderPayload
    >({
      query: (body) => ({
        url: "/admin/sliders/reorder",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Sliders" as const, id: "LIST" }],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: Set Status (aktif/pasif)                           */
    /*  POST /admin/sliders/:id/status                            */
    /* --------------------------------------------------------- */
    setSliderStatusAdmin: build.mutation<
      SliderAdminDto,
      { id: number | string; payload: SliderSetStatusPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/sliders/${id}/status`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: ApiSliderAdmin) =>
        normalizeSliderAdmin(response),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Sliders" as const, id: String(arg.id) },
        { type: "Sliders" as const, id: "LIST" },
      ],
    }),

    /* --------------------------------------------------------- */
    /*  ADMIN: Set Image                                          */
    /*  PATCH /admin/sliders/:id/image                            */
    /* --------------------------------------------------------- */
    setSliderImageAdmin: build.mutation<
      SliderAdminDto,
      { id: number | string; payload: SliderSetImagePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/sliders/${id}/image`,
        method: "PATCH",
        body: payload,
      }),
      transformResponse: (response: ApiSliderAdmin) =>
        normalizeSliderAdmin(response),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Sliders" as const, id: String(arg.id) },
        { type: "Sliders" as const, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListSlidersAdminQuery,
  useGetSliderAdminQuery,
  useCreateSliderAdminMutation,
  useUpdateSliderAdminMutation,
  useDeleteSliderAdminMutation,
  useReorderSlidersAdminMutation,
  useSetSliderStatusAdminMutation,
  useSetSliderImageAdminMutation,
} = slidersAdminApi;
