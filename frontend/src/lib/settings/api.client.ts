// src/lib/settings/api.client.ts

"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import type { SupportedLocale } from "@/types/common";
import type {
  ISetting,
  ApiEnvelope,
  ApiMessage,
  SettingsListParams,
  UpsertSettingInput,
  UploadSettingsImagesInput,
  UpdateSettingsImagesInput,
  DeleteSettingInput,
} from "./types";

/**
 * RTK Query — Settings (public & admin)
 * Not: Header'lar interceptor'dan geliyor. Locale override etmek istersen
 *      lower-case header gönder: { "accept-language": locale }
 */
export const settingsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /settings — public list */
    list: builder.query<ISetting[], SettingsListParams | void>({
      query: (args) => ({
        url: "settings",
        method: "GET",
        headers: args?.locale ? { "accept-language": String(args.locale) } : undefined,
      }),
      transformResponse: (res: ISetting[] | ApiEnvelope<ISetting[]>) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "SettingList" as const, id: "LIST" },
              ...result.map((s) => ({ type: "Setting" as const, id: s.key })),
            ]
          : [{ type: "SettingList" as const, id: "LIST" }],
    }),

    /** GET /settings/admin — admin list */
    adminList: builder.query<ISetting[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "settings/admin",
        method: "GET",
        headers: args?.locale ? { "accept-language": String(args.locale) } : undefined,
      }),
      transformResponse: (res: ISetting[] | ApiEnvelope<ISetting[]>) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "SettingAdminList" as const, id: "LIST" },
              ...result.map((s) => ({ type: "Setting" as const, id: s.key })),
            ]
          : [{ type: "SettingAdminList" as const, id: "LIST" }],
    }),

    /** POST /settings/admin — upsert (admin) */
    upsert: builder.mutation<ApiMessage<ISetting>, UpsertSettingInput>({
      query: ({ locale, ...body }) => ({
        url: "settings/admin",
        method: "POST",
        data: body,
        headers: locale ? { "accept-language": String(locale) } : undefined,
      }),
      transformResponse: (res: ApiMessage<ISetting> | ApiEnvelope<ISetting>) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: (res) =>
        res?.data
          ? [{ type: "Setting", id: res.data.key }, { type: "SettingAdminList", id: "LIST" }]
          : [{ type: "SettingAdminList", id: "LIST" }],
    }),

    /** POST /settings/admin/upload/:key — upload images (admin) */
    uploadImages: builder.mutation<ApiMessage<ISetting>, UploadSettingsImagesInput>({
      query: ({ key, files, locale }) => {
        const fd = new FormData();
        files.forEach((f) => fd.append("images", f));
        return {
          url: `settings/admin/upload/${encodeURIComponent(key)}`,
          method: "POST",
          data: fd,
          headers: locale ? { "accept-language": String(locale) } : undefined,
        };
      },
      transformResponse: (res: ApiMessage<ISetting> | ApiEnvelope<ISetting>) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: (res) =>
        res?.data
          ? [{ type: "Setting", id: res.data.key }, { type: "SettingAdminList", id: "LIST" }]
          : [{ type: "SettingAdminList", id: "LIST" }],
    }),

    /** PUT /settings/admin/upload/:key — update images (admin) */
    updateImages: builder.mutation<ApiMessage<ISetting>, UpdateSettingsImagesInput>({
      query: ({ key, files, removedImages, locale }) => {
        const fd = new FormData();
        files.forEach((f) => fd.append("images", f));
        if (removedImages?.length) {
          fd.append("removedImages", JSON.stringify(removedImages));
        }
        return {
          url: `settings/admin/upload/${encodeURIComponent(key)}`,
          method: "PUT",
          data: fd,
          headers: locale ? { "accept-language": String(locale) } : undefined,
        };
      },
      transformResponse: (res: ApiMessage<ISetting> | ApiEnvelope<ISetting>) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: (res) =>
        res?.data
          ? [{ type: "Setting", id: res.data.key }, { type: "SettingAdminList", id: "LIST" }]
          : [{ type: "SettingAdminList", id: "LIST" }],
    }),

    /** DELETE /settings/admin/:key — delete (admin) */
    delete: builder.mutation<{ key: string; message?: string }, DeleteSettingInput>({
      query: ({ key, locale }) => ({
        url: `settings/admin/${encodeURIComponent(key)}`,
        method: "DELETE",
        headers: locale ? { "accept-language": String(locale) } : undefined,
      }),
      transformResponse: (_: unknown, _meta, arg) => ({ key: arg.key }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Setting", id: arg.key },
        { type: "SettingAdminList", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListQuery: useSettingsListQuery,
  useAdminListQuery: useSettingsAdminListQuery,
  useUpsertMutation: useUpsertSettingMutation,
  useUploadImagesMutation: useSettingsUploadImagesMutation,
  useUpdateImagesMutation: useSettingsUpdateImagesMutation,
  useDeleteMutation: useDeleteSettingMutation,
} = settingsApi;
