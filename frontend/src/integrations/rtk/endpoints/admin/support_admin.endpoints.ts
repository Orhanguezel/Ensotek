// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/support_admin.endpoints.ts
// Admin – Support Tickets + Ticket Replies RTK Endpoints
// =============================================================

import { baseApi } from "../../baseApi";
import type {
  AdminSupportTicketDto,
  AdminSupportTicketListQueryParams,
  AdminSupportTicketListResponse,
  TicketReplyDto,
  TicketReplyAdminCreatePayload,
} from "@/integrations/types/support.types";

export const supportAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // -------- ADMIN TICKETS: LIST --------
    listSupportTicketsAdmin: build.query<
      AdminSupportTicketListResponse,
      AdminSupportTicketListQueryParams | void
    >({
      query: (params?: AdminSupportTicketListQueryParams) => ({
        url: "/admin/support_tickets",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: AdminSupportTicketDto[],
        meta,
      ): AdminSupportTicketListResponse => {
        const items = response ?? [];
        const header =
          (meta as any)?.response?.headers?.get?.("x-total-count") ??
          (meta as any)?.response?.headers?.get?.("X-Total-Count");
        const total = header ? Number(header) || items.length : items.length;
        return { items, total };
      },
    }),

    // -------- ADMIN TICKETS: GET BY ID --------
    getSupportTicketAdmin: build.query<
      AdminSupportTicketDto,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/admin/support_tickets/${encodeURIComponent(id)}`,
        method: "GET",
      }),
    }),

    // -------- ADMIN TICKETS: UPDATE --------
    updateSupportTicketAdmin: build.mutation<
      AdminSupportTicketDto,
      { id: string; patch: Partial<AdminSupportTicketDto> }
    >({
      query: ({ id, patch }) => ({
        url: `/admin/support_tickets/${encodeURIComponent(id)}`,
        method: "PATCH",
        // patch type'ını daha sıkı yapmak istersen
        // SupportTicketUpdatePayload kullanabilirsin
        body: patch,
      }),
    }),

    // -------- ADMIN TICKETS: DELETE --------
    deleteSupportTicketAdmin: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/support_tickets/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
    }),

    // -------- ADMIN TICKETS: TOGGLE STATUS (close/reopen) --------
    toggleSupportTicketAdmin: build.mutation<
      AdminSupportTicketDto,
      { id: string; action: "close" | "reopen" }
    >({
      query: ({ id, action }) => ({
        url: `/admin/support_tickets/${encodeURIComponent(
          id,
        )}/${encodeURIComponent(action)}`,
        method: "POST",
      }),
    }),

    // -------- ADMIN REPLIES: LIST BY TICKET --------
    listTicketRepliesAdmin: build.query<TicketReplyDto[], { ticketId: string }>(
      {
        query: ({ ticketId }) => ({
          url: `/admin/ticket_replies/by-ticket/${encodeURIComponent(
            ticketId,
          )}`,
          method: "GET",
        }),
      },
    ),

    // -------- ADMIN REPLIES: CREATE --------
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

    // -------- ADMIN REPLIES: DELETE --------
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
  useListSupportTicketsAdminQuery,
  useGetSupportTicketAdminQuery,
  useUpdateSupportTicketAdminMutation,
  useDeleteSupportTicketAdminMutation,
  useToggleSupportTicketAdminMutation,
  useListTicketRepliesAdminQuery,
  useCreateTicketReplyAdminMutation,
  useDeleteTicketReplyAdminMutation,
} = supportAdminApi;
