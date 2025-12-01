"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/rtk/axiosBaseQuery";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  IFaq,
  ApiEnvelope,
  ApiMessage,
  FaqListParams,
  CreateFaqInput,
  UpdateFaqInput,
  DeleteFaqInput,
  TogglePublishInput,
  AskFaqInput,
  AskFaqOutput,
} from "./types";

/**
 * RTK Query – FAQ (Public & Admin)
 * Endpoints, slice'taki /faq, /faq/admin, /faq/ask rotalarıyla birebir uyumludur.
 */
export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Faq", "FaqList", "FaqAdminList"],
  endpoints: (builder) => ({
    // PUBLIC
    list: builder.query<IFaq[], FaqListParams | void>({
      query: (args) => ({
        url: "faq",
        method: "GET",
        params: args
          ? {
            limit: args.limit,
            page: args.page,
            sort: args.sort,
            q: args.q,
            category: args.category,
            isPublished:
              typeof args.isPublished === "boolean"
                ? String(args.isPublished)
                : undefined,
          }
          : undefined,
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: IFaq[] | ApiEnvelope<IFaq[]>) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
            { type: "FaqList", id: "LIST" },
            ...result.map((f) => ({ type: "Faq" as const, id: f._id })),
          ]
          : [{ type: "FaqList", id: "LIST" }],
    }),

    // ADMIN
    adminList: builder.query<IFaq[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "faq/admin",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: IFaq[] | ApiEnvelope<IFaq[]>) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
            { type: "FaqAdminList", id: "LIST" },
            ...result.map((f) => ({ type: "Faq" as const, id: f._id })),
          ]
          : [{ type: "FaqAdminList", id: "LIST" }],
    }),

    create: builder.mutation<ApiMessage<IFaq>, CreateFaqInput>({
      query: ({ payload, locale }) => ({
        url: "faq/admin",
        method: "POST",
        data: payload,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiMessage<IFaq> | ApiEnvelope<IFaq>) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: [{ type: "FaqAdminList", id: "LIST" }],
    }),

    update: builder.mutation<ApiMessage<IFaq>, UpdateFaqInput>({
      query: ({ id, payload, locale }) => ({
        url: `faq/admin/${encodeURIComponent(id)}`,
        method: "PUT",
        data: payload,
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiMessage<IFaq> | ApiEnvelope<IFaq>) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: (res) =>
        res?.data?._id
          ? [{ type: "Faq", id: res.data._id }, { type: "FaqAdminList", id: "LIST" }]
          : [{ type: "FaqAdminList", id: "LIST" }],
    }),

    delete: builder.mutation<{ id: string; message?: string }, DeleteFaqInput>({
      query: ({ id, locale }) => ({
        url: `faq/admin/${encodeURIComponent(id)}`,
        method: "DELETE",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (_: unknown, _meta, arg) => ({ id: arg.id }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Faq", id: arg.id },
        { type: "FaqAdminList", id: "LIST" },
      ],
    }),

    togglePublish: builder.mutation<ApiMessage<IFaq>, TogglePublishInput>({
      query: ({ id, isPublished, locale }) => ({
        url: `faq/admin/${encodeURIComponent(id)}`,
        method: "PUT",
        data: { isPublished }, // JSON body
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiMessage<IFaq> | ApiEnvelope<IFaq>) =>
        "data" in (res as any) ? (res as any) : { data: res as any },
      invalidatesTags: (res) =>
        res?.data?._id
          ? [{ type: "Faq", id: res.data._id }, { type: "FaqAdminList", id: "LIST" }]
          : [{ type: "FaqAdminList", id: "LIST" }],
    }),

    // AI / Ask
    ask: builder.mutation<AskFaqOutput, AskFaqInput>({
      query: ({ question, locale }) => ({
        url: "faq/ask",
        method: "POST",
        data: { question },
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: AskFaqOutput | ApiEnvelope<AskFaqOutput>) =>
        "data" in (res as any) ? (res as any).data : (res as AskFaqOutput),
    }),
  }),
});

export const {
  useListQuery: useFaqListQuery,
  useAdminListQuery: useFaqAdminListQuery,
  useCreateMutation: useFaqCreateMutation,
  useUpdateMutation: useFaqUpdateMutation,
  useDeleteMutation: useFaqDeleteMutation,
  useTogglePublishMutation: useFaqTogglePublishMutation,
  useAskMutation: useFaqAskMutation,
} = faqApi;
