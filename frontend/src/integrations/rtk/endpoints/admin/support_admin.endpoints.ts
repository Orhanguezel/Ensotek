// =============================================================
// FILE: src/integrations/rtk/endpoints/admin/support_admin.endpoints.ts
// Ensotek – Admin Support Tickets & Replies (RTK Query)
// =============================================================

import { baseApi } from "@/integrations/rtk/baseApi";

import type {
  AdminSupportTicketDto,
  AdminSupportTicketListQueryParams,
  AdminSupportTicketListResponse,
  TicketReplyDto,
  TicketReplyAdminCreatePayload,
  SupportTicketUpdatePayload,
} from "@/integrations/types/support.types";

// -------------------- Arg tipleri --------------------

type GetTicketArgs = { id: string };

type UpdateTicketArgs = {
  id: string;
  patch: SupportTicketUpdatePayload;
};

type DeleteTicketArgs = { id: string };

type ToggleTicketArgs = {
  id: string;
  action: "open" | "close" | "reopen" | "in_progress" | "waiting_response";
};

type ListRepliesArgs = { ticketId: string };

type DeleteReplyArgs = { id: string };

// =============================================================
// RTK endpoints
// =============================================================

export const supportAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Ticket list (admin)
    listSupportTicketsAdmin: builder.query<
      AdminSupportTicketListResponse,
      AdminSupportTicketListQueryParams | undefined
    >({
      query: (params) => ({
        url: "/admin/support/tickets",
        method: "GET",
        params: params ?? undefined,
      }),
    }),

    // Ticket detail (admin)
    getSupportTicketAdmin: builder.query<AdminSupportTicketDto, GetTicketArgs>({
      query: ({ id }) => ({
        url: `/admin/support/tickets/${encodeURIComponent(id)}`,
        method: "GET",
      }),
    }),

    // Ticket update (admin)
    updateSupportTicketAdmin: builder.mutation<
      AdminSupportTicketDto,
      UpdateTicketArgs
    >({
      query: ({ id, patch }) => ({
        url: `/admin/support/tickets/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: patch,
      }),
    }),

    // Ticket delete (admin)
    deleteSupportTicketAdmin: builder.mutation<void, DeleteTicketArgs>({
      query: ({ id }) => ({
        url: `/admin/support/tickets/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
    }),

    // Ticket status toggle (admin)
    toggleSupportTicketAdmin: builder.mutation<
      AdminSupportTicketDto,
      ToggleTicketArgs
    >({
      query: ({ id, action }) => ({
        url: `/admin/support/tickets/${encodeURIComponent(id)}/status`,
        method: "POST",
        body: { action },
      }),
    }),

    // Replies list (admin)
    listTicketRepliesAdmin: builder.query<TicketReplyDto[], ListRepliesArgs>({
      query: ({ ticketId }) => ({
        url: `/admin/support/tickets/${encodeURIComponent(ticketId)}/replies`,
        method: "GET",
      }),
    }),

    // Create reply (admin)
    createTicketReplyAdmin: builder.mutation<
      TicketReplyDto,
      TicketReplyAdminCreatePayload
    >({
      query: (body) => ({
        url: "/admin/support/replies",
        method: "POST",
        body,
      }),
    }),

    // Delete reply (admin)
    deleteTicketReplyAdmin: builder.mutation<void, DeleteReplyArgs>({
      query: ({ id }) => ({
        url: `/admin/support/replies/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: true,
});

// =============================================================
// Hooks – İSİMLER BİREBİR BURADA
// =============================================================

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
