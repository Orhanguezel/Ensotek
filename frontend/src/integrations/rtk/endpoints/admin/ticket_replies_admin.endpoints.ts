// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/ticket_replies_admin.endpoints.ts
// Admin – Ticket Replies RTK Endpoints (optional separate file)
// =============================================================

import { baseApi } from "../../baseApi";
import type {
  TicketReplyDto,
  TicketReplyAdminCreatePayload,
} from "@/integrations/types/support.types";

export const ticketRepliesAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTicketRepliesAdmin: build.query<TicketReplyDto[], string>({
      query: (ticketId) => ({
        url: `/admin/ticket_replies/by-ticket/${encodeURIComponent(
          ticketId,
        )}`,
        method: "GET",
      }),
    }),

    createTicketReplyAdmin: build.mutation<
      TicketReplyDto,
      TicketReplyAdminCreatePayload
    >({
      query: (body) => ({
        url: "/admin/ticket_replies",
        method: "POST",
        body,
      }),
    }),

    deleteTicketReplyAdmin: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/ticket_replies/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListTicketRepliesAdminQuery,
  useCreateTicketReplyAdminMutation,
  useDeleteTicketReplyAdminMutation,
} = ticketRepliesAdminApi;
