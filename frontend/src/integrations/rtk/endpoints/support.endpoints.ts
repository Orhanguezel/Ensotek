// =============================================================
// FILE: src/integrations/rtk/endpoints/support.endpoints.ts
// Public Support Tickets + Replies RTK Endpoints
// =============================================================

import { baseApi } from "../baseApi";
import type {
  SupportTicketDto,
  SupportTicketListQueryParams,
  SupportTicketListResponse,
  SupportTicketCreatePayload,
  SupportTicketUpdatePayload,
  TicketReplyDto,
  TicketReplyCreatePayload,
} from "@/integrations/types/support.types";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // -------- TICKETS: LIST (PUBLIC) --------
    listSupportTickets: build.query<
      SupportTicketListResponse,
      SupportTicketListQueryParams | void
    >({
      query: (params?: SupportTicketListQueryParams) => ({
        url: "/support_tickets",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: SupportTicketDto[],
        meta,
      ): SupportTicketListResponse => {
        const items = response ?? [];
        const header =
          (meta as any)?.response?.headers?.get?.("x-total-count") ??
          (meta as any)?.response?.headers?.get?.("X-Total-Count");
        const total = header ? Number(header) || items.length : items.length;
        return { items, total };
      },
    }),

    // -------- TICKETS: GET BY ID (PUBLIC) --------
    getSupportTicket: build.query<SupportTicketDto, { id: string }>({
      query: ({ id }) => ({
        url: `/support_tickets/${encodeURIComponent(id)}`,
        method: "GET",
      }),
    }),

    // -------- TICKETS: CREATE (PROTECTED) --------
    createSupportTicket: build.mutation<
      SupportTicketDto,
      SupportTicketCreatePayload
    >({
      query: (body) => ({
        url: "/support_tickets",
        method: "POST",
        body,
      }),
    }),

    // -------- TICKETS: UPDATE (PROTECTED) --------
    updateSupportTicket: build.mutation<
      SupportTicketDto,
      { id: string; patch: SupportTicketUpdatePayload }
    >({
      query: ({ id, patch }) => ({
        url: `/support_tickets/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: patch,
      }),
    }),

    // -------- REPLIES: LIST BY TICKET (PUBLIC) --------
    listTicketReplies: build.query<TicketReplyDto[], { ticketId: string }>({
      query: ({ ticketId }) => ({
        url: `/ticket_replies/by-ticket/${encodeURIComponent(ticketId)}`,
        method: "GET",
      }),
    }),

    // -------- REPLIES: CREATE (PROTECTED) --------
    createTicketReply: build.mutation<TicketReplyDto, TicketReplyCreatePayload>(
      {
        query: (body) => ({
          url: "/ticket_replies",
          method: "POST",
          body,
        }),
      },
    ),
  }),
  overrideExisting: false,
});

export const {
  useListSupportTicketsQuery,
  useGetSupportTicketQuery,
  useCreateSupportTicketMutation,
  useUpdateSupportTicketMutation,
  useListTicketRepliesQuery,
  useCreateTicketReplyMutation,
} = supportApi;
