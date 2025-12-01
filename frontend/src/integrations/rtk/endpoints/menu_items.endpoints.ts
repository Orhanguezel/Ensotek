// =============================================================
// FILE: src/integrations/rtk/endpoints/menu_items.endpoints.ts
// Ensotek – Public Menu Items RTK endpoints
// =============================================================

import { baseApi } from "../baseApi";
import type {
  PublicMenuItemDto,
  PublicMenuItemListQueryParams,
  MenuItemListResponse,
} from "@/integrations/types/menu_items.types";

type MetaWithHeaders = {
  response?: {
    headers?: {
      get: (name: string) => string | null;
    };
  };
};

const parseTotalFromMeta = (
  dataLength: number,
  meta?: MetaWithHeaders | unknown,
): number => {
  const m = meta as MetaWithHeaders | undefined;
  const raw = m?.response?.headers?.get("x-total-count");
  if (!raw) return dataLength;
  const n = Number(raw);
  return Number.isFinite(n) ? n : dataLength;
};

export const menuItemsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // LIST – GET /menu_items
    listMenuItems: build.query<
      MenuItemListResponse<PublicMenuItemDto>,
      PublicMenuItemListQueryParams | void
    >({
      query: (params?: PublicMenuItemListQueryParams) => ({
        url: "/menu_items",
        method: "GET",
        params,
      }),
      transformResponse: (
        data: PublicMenuItemDto[],
        meta?: MetaWithHeaders,
      ) => {
        const total = parseTotalFromMeta(data?.length ?? 0, meta);
        return {
          items: data ?? [],
          total,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              { type: "MenuItemPublic" as const, id: "LIST" },
              ...result.items.map((m) => ({
                type: "MenuItemPublic" as const,
                id: m.id,
              })),
            ]
          : [{ type: "MenuItemPublic" as const, id: "LIST" }],
    }),

    // GET by id – GET /menu_items/:id
    getMenuItem: build.query<PublicMenuItemDto, string>({
      query: (id) => ({
        url: `/menu_items/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [
        { type: "MenuItemPublic" as const, id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListMenuItemsQuery,
  useGetMenuItemQuery,
} = menuItemsApi;
