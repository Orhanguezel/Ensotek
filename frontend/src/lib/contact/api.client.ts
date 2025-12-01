"use client";

import { rootApi } from "@/lib/rtk/rootApi";
import type { ApiEnvelope, IContactMessage, ContactSendPayload, ContactListParams } from "./types";

/**
 * RTK Query – Contact (public + admin)
 * Benzersiz endpoint isimleri: contactSendMessage, contactAdminList ...
 */
export const contactApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    /** POST /contact — public send message */
    contactSendMessage: builder.mutation<IContactMessage, ContactSendPayload>({
      query: (payload) => ({
        url: "contact",
        method: "POST",
        data: payload,
        // CSRF'siz public endpoint ise: csrfDisabled: true,
      }),
      transformResponse: (res: ApiEnvelope<IContactMessage> | IContactMessage) =>
        (res as any)?.data ?? (res as IContactMessage),
      invalidatesTags: [{ type: "ContactList", id: "LIST" }],
    }),

    /** GET /contact — admin list */
    contactAdminList: builder.query<IContactMessage[], ContactListParams | void>({
      query: (args) => ({
        url: "contact",
        method: "GET",
        params: args,
      }),
      transformResponse: (res: ApiEnvelope<IContactMessage[]> | IContactMessage[]) =>
        Array.isArray(res) ? res : (res?.data ?? []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [{ type: "ContactList" as const, id: "LIST" },
             ...result.map((m) => ({ type: "Contact" as const, id: m._id }))]
          : [{ type: "ContactList" as const, id: "LIST" }],
    }),

    /** DELETE /contact/:id — admin delete */
    contactDelete: builder.mutation<string, string>({
      query: (id) => ({
        url: `contact/${id}`,
        method: "DELETE",
      }),
      transformResponse: (_: unknown, __, id) => id,
      invalidatesTags: (id) =>
        typeof id === "string"
          ? [{ type: "ContactList", id: "LIST" }, { type: "Contact", id }]
          : [{ type: "ContactList", id: "LIST" }],
    }),

    /** PATCH /contact/:id/read — admin mark read */
    contactMarkRead: builder.mutation<IContactMessage, string>({
      query: (id) => ({
        url: `contact/${id}/read`,
        method: "PATCH",
      }),
      transformResponse: (res: ApiEnvelope<IContactMessage> | IContactMessage) =>
        (res as any)?.data ?? (res as IContactMessage),
      invalidatesTags: (res) => (res ? [{ type: "Contact", id: res._id }] : []),
    }),
  }),
  overrideExisting: false,
});

export const {
  useContactSendMessageMutation,
  useContactAdminListQuery,
  useContactDeleteMutation,
  useContactMarkReadMutation,
} = contactApi;
