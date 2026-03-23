// =============================================================
// FILE: src/integrations/shared/support.ts
// =============================================================

export type SupportTicketStatus = "open" | "in_progress" | "waiting_response" | "closed";
export type SupportTicketPriority = "low" | "medium" | "high" | "urgent";

export type SupportTicketView = {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: string | null;
  created_at: string;
  updated_at: string;
  user_display_name: string | null;
  user_email: string | null;
};

export type TicketReplyView = {
  id: string;
  ticket_id: string;
  user_id: string | null;
  message: string;
  is_admin: boolean;
  created_at: string;
};

export type SupportTicketListParams = {
  q?: string;
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  sort?: "created_at" | "updated_at";
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
};

export type SupportTicketListResponse = {
  data: SupportTicketView[];
  total: number;
};

export type SupportTicketUpdatePayload = {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  subject?: string;
  message?: string;
};

export type CreateReplyPayload = {
  ticket_id: string;
  message: string;
  is_admin: true;
};
