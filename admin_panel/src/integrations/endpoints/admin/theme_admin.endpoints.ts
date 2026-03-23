// =============================================================
// FILE: src/integrations/endpoints/admin/theme_admin.endpoints.ts
// Theme admin hooks — wraps site_settings 'ui_admin_theme' key
// =============================================================

import { baseApi } from "@/integrations/baseApi";
import type { SettingValue } from "@/integrations/shared";

const ADMIN_BASE = "/admin/site_settings";
const THEME_KEY = "ui_admin_theme";

const extendedApi = baseApi.enhanceEndpoints({ addTagTypes: ["AdminTheme"] as const });

export const themeAdminApi = extendedApi.injectEndpoints({
  endpoints: (b) => ({
    getThemeAdmin: b.query<Record<string, unknown>, void>({
      query: () => ({ url: `${ADMIN_BASE}/${THEME_KEY}` }),
      transformResponse: (res: unknown): Record<string, unknown> => {
        if (!res || typeof res !== "object") return {};
        const r = res as Record<string, unknown>;
        let value = r.value;
        if (typeof value === "string") {
          try {
            value = JSON.parse(value);
          } catch {
            value = {};
          }
        }
        return (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
      },
      providesTags: [{ type: "AdminTheme", id: "CURRENT" }],
    }),

    updateThemeAdmin: b.mutation<void, Record<string, unknown>>({
      query: (body) => ({
        url: `${ADMIN_BASE}/${THEME_KEY}`,
        method: "PUT",
        body: { key: THEME_KEY, value: body as SettingValue },
      }),
      invalidatesTags: [{ type: "AdminTheme", id: "CURRENT" }],
    }),

    resetThemeAdmin: b.mutation<Record<string, unknown>, void>({
      query: () => ({
        url: `${ADMIN_BASE}/${THEME_KEY}`,
        method: "PUT",
        body: { key: THEME_KEY, value: {} },
      }),
      transformResponse: () => ({}),
      invalidatesTags: [{ type: "AdminTheme", id: "CURRENT" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetThemeAdminQuery, useUpdateThemeAdminMutation, useResetThemeAdminMutation } = themeAdminApi;
