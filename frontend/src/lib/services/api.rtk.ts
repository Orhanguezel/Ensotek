"use client";

import type { SupportedLocale } from "@/types/common";
import { buildCommonHeaders } from "@/lib/http";
import { rootApi } from "@/lib/rtk/rootApi";
import type { IServices, ApiEnvelope, ServicesListParams } from "./types";

export const servicesApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /services — public list */
    servicesList: builder.query<IServices[], ServicesListParams | void>({
      query: (args) => {
        const params = new URLSearchParams();
        const limit  = args?.limit ?? 6;
        const sort   = args?.sort ?? "-publishedAt";
        const pub    = (args?.isPublished ?? true).toString();

        params.set("limit", String(limit));
        params.set("sort", sort);
        params.set("isPublished", pub);
        if (args?.offset) params.set("offset", String(args.offset));
        if (args?.q)      params.set("q", args.q);

        return {
          url: `services${params.toString() ? `?${params}` : ""}`,
          method: "GET",
          headers: args?.locale ? buildCommonHeaders(args.locale as SupportedLocale) : undefined,
        };
      },
      transformResponse: (res: IServices[] | ApiEnvelope<IServices[]>) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "ServicesList", id: "LIST" },
              ...result.map((a) => ({ type: "Services" as const, id: a._id })),
            ]
          : [{ type: "ServicesList", id: "LIST" }],
    }),

    /** GET /services/admin — admin list */
    servicesAdminList: builder.query<IServices[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "services/admin",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: IServices[] | ApiEnvelope<IServices[]>) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              { type: "ServicesAdminList", id: "LIST" },
              ...result.map((a) => ({ type: "Services" as const, id: a._id })),
            ]
          : [{ type: "ServicesAdminList", id: "LIST" }],
    }),

    /** GET /services/slug/:slug — public single */
    servicesBySlug: builder.query<IServices | null, { slug: string; locale?: SupportedLocale }>({
      query: ({ slug, locale }) => ({
        url: `services/slug/${encodeURIComponent(slug)}`,
        method: "GET",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: IServices | ApiEnvelope<IServices>) =>
        "data" in (res as any) ? (res as any).data : (res as any),
      providesTags: (res) =>
        res ? [{ type: "Services", id: res._id }] : [{ type: "ServicesList", id: "LIST" }],
    }),

    /** POST /services/admin — create (FormData) */
    createService: builder.mutation<{ data: IServices; message?: string }, { formData: FormData; locale?: SupportedLocale }>({
      query: ({ formData, locale }) => ({
        url: "services/admin",
        method: "POST",
        data: formData,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: any) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: [{ type: "ServicesAdminList", id: "LIST" }, { type: "ServicesList", id: "LIST" }],
    }),

    /** PUT /services/admin/:id — update (FormData) */
    updateService: builder.mutation<{ data: IServices; message?: string }, { id: string; formData: FormData; locale?: SupportedLocale }>({
      query: ({ id, formData, locale }) => ({
        url: `services/admin/${encodeURIComponent(id)}`,
        method: "PUT",
        data: formData,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: any) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: (res) =>
        res?.data
          ? [
              { type: "Services", id: res.data._id },
              { type: "ServicesAdminList", id: "LIST" },
              { type: "ServicesList", id: "LIST" },
            ]
          : [{ type: "ServicesAdminList", id: "LIST" }, { type: "ServicesList", id: "LIST" }],
    }),

    /** DELETE /services/admin/:id */
    deleteService: builder.mutation<{ id: string; message?: string }, { id: string; locale?: SupportedLocale }>({
      query: ({ id, locale }) => ({
        url: `services/admin/${encodeURIComponent(id)}`,
        method: "DELETE",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (_: unknown, _meta, arg) => ({ id: arg.id }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Services", id: arg.id },
        { type: "ServicesAdminList", id: "LIST" },
        { type: "ServicesList", id: "LIST" },
      ],
    }),

    /** PUT /services/admin/:id — toggle publish */
    togglePublishService: builder.mutation<{ data: IServices; message?: string }, { id: string; isPublished: boolean; locale?: SupportedLocale }>({
      query: ({ id, isPublished, locale }) => ({
        url: `services/admin/${encodeURIComponent(id)}`,
        method: "PUT",
        data: { isPublished },
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: any) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: (res) =>
        res?.data
          ? [
              { type: "Services", id: res.data._id },
              { type: "ServicesAdminList", id: "LIST" },
              { type: "ServicesList", id: "LIST" },
            ]
          : [{ type: "ServicesAdminList", id: "LIST" }, { type: "ServicesList", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useServicesListQuery,
  useServicesAdminListQuery,
  useServicesBySlugQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useTogglePublishServiceMutation,
} = servicesApi;
