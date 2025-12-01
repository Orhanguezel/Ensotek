"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import { buildCommonHeaders } from "@/lib/http";
import type { SupportedLocale } from "@/types/common";
import type {
  INewsletter,
  ApiEnvelope,
  SubscribePayload,
  BulkSendPayload,
} from "./types";

export const newsletterApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ---------- PUBLIC ---------- */

    /** POST /newsletter — subscribe */
    subscribe: builder.mutation<INewsletter, { payload: SubscribePayload; locale?: SupportedLocale }>({
      query: ({ payload, locale }) => ({
        url: "newsletter",
        method: "POST",
        headers: locale ? buildCommonHeaders(locale) : undefined,
        data: payload,
      }),
      transformResponse: (res: ApiEnvelope<INewsletter> | INewsletter) =>
        (res as any).data ? (res as ApiEnvelope<INewsletter>).data : (res as INewsletter),
      invalidatesTags: [{ type: "NewsletterList", id: "LIST" }],
    }),

    /** POST /newsletter/unsubscribe */
    unsubscribe: builder.mutation<INewsletter, { email: string; locale?: SupportedLocale }>({
      query: ({ email, locale }) => ({
        url: "newsletter/unsubscribe",
        method: "POST",
        headers: locale ? buildCommonHeaders(locale) : undefined,
        data: { email },
      }),
      transformResponse: (res: ApiEnvelope<INewsletter> | INewsletter) =>
        (res as any).data ? (res as ApiEnvelope<INewsletter>).data : (res as INewsletter),
      invalidatesTags: [{ type: "NewsletterList", id: "LIST" }],
    }),

    /* ---------- ADMIN ---------- */

    /** GET /newsletter — list */
    list: builder.query<INewsletter[], { locale?: SupportedLocale } | void>({
      query: (args) => ({
        url: "newsletter",
        method: "GET",
        headers: args?.locale ? buildCommonHeaders(args.locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<INewsletter[]> | INewsletter[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [{ type: "NewsletterList", id: "LIST" }, ...result.map((x) => ({ type: "Newsletter" as const, id: x._id }))]
          : [{ type: "NewsletterList", id: "LIST" }],
    }),

    /** DELETE /newsletter/:id */
    delete: builder.mutation<string, { id: string; locale?: SupportedLocale }>({
      query: ({ id, locale }) => ({
        url: `newsletter/${encodeURIComponent(id)}`,
        method: "DELETE",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (_: unknown, __, arg) => arg.id,
      invalidatesTags: (r, e, arg) => [{ type: "Newsletter", id: arg.id }, { type: "NewsletterList", id: "LIST" }],
    }),

    /** PATCH /newsletter/:id/verify */
    verify: builder.mutation<INewsletter, { id: string; locale?: SupportedLocale }>({
      query: ({ id, locale }) => ({
        url: `newsletter/${encodeURIComponent(id)}/verify`,
        method: "PATCH",
        headers: locale ? buildCommonHeaders(locale) : undefined,
      }),
      transformResponse: (res: ApiEnvelope<INewsletter> | INewsletter) =>
        (res as any).data ? (res as ApiEnvelope<INewsletter>).data : (res as INewsletter),
      invalidatesTags: (r) => (r ? [{ type: "Newsletter", id: r._id }, { type: "NewsletterList", id: "LIST" }] : []),
    }),

    /** POST /newsletter/send-bulk */
    sendBulk: builder.mutation<{ sent: number; total: number }, { payload: BulkSendPayload; locale?: SupportedLocale }>({
      query: ({ payload, locale }) => ({
        url: "newsletter/send-bulk",
        method: "POST",
        headers: locale ? buildCommonHeaders(locale) : undefined,
        data: payload,
      }),
      transformResponse: (res: ApiEnvelope<{ sent: number; total: number }> | { sent: number; total: number }) =>
        (res as any).data ? (res as ApiEnvelope<{ sent: number; total: number }>).data : (res as { sent: number; total: number }),
    }),

    /** POST /newsletter/:id/send */
    sendSingle: builder.mutation<void, { id: string; subject: string; html: string; locale?: SupportedLocale }>({
      query: ({ id, subject, html, locale }) => ({
        url: `newsletter/${encodeURIComponent(id)}/send`,
        method: "POST",
        headers: locale ? buildCommonHeaders(locale) : undefined,
        data: { subject, html },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubscribeMutation: useNewsletterSubscribeMutation,
  useUnsubscribeMutation: useNewsletterUnsubscribeMutation,
  useListQuery: useNewsletterListQuery,
  useDeleteMutation: useNewsletterDeleteMutation,
  useVerifyMutation: useNewsletterVerifyMutation,
  useSendBulkMutation: useNewsletterSendBulkMutation,
  useSendSingleMutation: useNewsletterSendSingleMutation,
} = newsletterApi;
