// =============================================================
// FILE: src/integrations/endpoints/admin/support_admin.endpoints.ts
// =============================================================

import { baseApi } from "@/integrations/baseApi";
import type {
  CreateReplyPayload,
  SupportTicketListParams,
  SupportTicketListResponse,
  SupportTicketUpdatePayload,
  SupportTicketView,
  TicketReplyView,
} from "@/integrations/shared";

const BASE_TICKETS = "/admin/support_tickets";
const BASE_REPLIES = "/admin/ticket_replies";

export const supportAdminApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    // -------------------------------------------------------
    // LIST tickets
    // -------------------------------------------------------
    listSupportTicketsAdmin: build.query<SupportTicketListResponse, SupportTicketListParams | undefined>({
      query: (params) => ({
        url: BASE_TICKETS,
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((t) => ({ type: "SupportTickets" as const, id: t.id })),
              { type: "SupportTickets" as const, id: "LIST" },
            ]
          : [{ type: "SupportTickets" as const, id: "LIST" }],
    }),

    // -------------------------------------------------------
    // GET single ticket
    // -------------------------------------------------------
    getSupportTicketAdmin: build.query<SupportTicketView, string>({
      query: (id) => ({ url: `${BASE_TICKETS}/${id}`, method: "GET" }),
      providesTags: (result) => (result ? [{ type: "SupportTicket" as const, id: result.id }] : []),
    }),

    // -------------------------------------------------------
    // UPDATE ticket (status, priority, subject, message)
    // -------------------------------------------------------
    updateSupportTicketAdmin: build.mutation<SupportTicketView, { id: string; patch: SupportTicketUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `${BASE_TICKETS}/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "SupportTicket" as const, id: arg.id },
        { type: "SupportTickets" as const, id: "LIST" },
      ],
    }),

    // -------------------------------------------------------
    // DELETE ticket
    // -------------------------------------------------------
    deleteSupportTicketAdmin: build.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `${BASE_TICKETS}/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "SupportTicket" as const, id },
        { type: "SupportTickets" as const, id: "LIST" },
      ],
    }),

    // -------------------------------------------------------
    // LIST replies by ticket
    // -------------------------------------------------------
    listRepliesAdmin: build.query<TicketReplyView[], string>({
      query: (ticketId) => ({
        url: `${BASE_REPLIES}/by-ticket/${ticketId}`,
        method: "GET",
      }),
      providesTags: (result, _error, ticketId) =>
        result
          ? [
              ...result.map((r) => ({ type: "TicketReply" as const, id: r.id })),
              { type: "TicketReplies" as const, id: ticketId },
            ]
          : [{ type: "TicketReplies" as const, id: ticketId }],
    }),

    // -------------------------------------------------------
    // CREATE reply (admin)
    // -------------------------------------------------------
    createReplyAdmin: build.mutation<TicketReplyView, CreateReplyPayload>({
      query: (body) => ({
        url: BASE_REPLIES,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "TicketReplies" as const, id: arg.ticket_id },
        { type: "SupportTickets" as const, id: "LIST" },
        { type: "SupportTicket" as const, id: arg.ticket_id },
      ],
    }),

    // -------------------------------------------------------
    // DELETE reply
    // -------------------------------------------------------
    deleteReplyAdmin: build.mutation<{ ok: boolean }, { id: string; ticket_id: string }>({
      query: ({ id }) => ({ url: `${BASE_REPLIES}/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "TicketReply" as const, id: arg.id },
        { type: "TicketReplies" as const, id: arg.ticket_id },
      ],
    }),
  }),
});

export const {
  useListSupportTicketsAdminQuery,
  useGetSupportTicketAdminQuery,
  useUpdateSupportTicketAdminMutation,
  useDeleteSupportTicketAdminMutation,
  useListRepliesAdminQuery,
  useCreateReplyAdminMutation,
  useDeleteReplyAdminMutation,
} = supportAdminApi;
