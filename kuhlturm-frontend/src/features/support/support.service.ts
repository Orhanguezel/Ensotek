import api from '@/lib/axios';
import type {
  SupportTicket,
  TicketReply,
  CreateTicketRequest,
  CreateReplyRequest,
  UpdateTicketRequest,
} from './support.type';

export const supportService = {
  // Tickets
  getTickets: () =>
    api.get<SupportTicket[]>('/support_tickets').then((r) => r.data),
  getTicket: (id: string) =>
    api.get<SupportTicket>(`/support_tickets/${id}`).then((r) => r.data),
  createTicket: (data: CreateTicketRequest) =>
    api.post<SupportTicket>('/support_tickets', data).then((r) => r.data),
  updateTicket: (id: string, data: UpdateTicketRequest) =>
    api.patch<SupportTicket>(`/support_tickets/${id}`, data).then((r) => r.data),

  // Replies
  getReplies: (ticketId: string) =>
    api.get<TicketReply[]>(`/ticket_replies/by-ticket/${ticketId}`).then((r) => r.data),
  addReply: (data: CreateReplyRequest) =>
    api.post<TicketReply>('/ticket_replies', data).then((r) => r.data),
};
