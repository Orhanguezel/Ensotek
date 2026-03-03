import { z } from 'zod';

export const ticketSchema = z.object({
  subject: z.string().min(5, 'Konu en az 5 karakter'),
  message: z.string().min(10, 'Mesaj en az 10 karakter'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export const replySchema = z.object({
  ticket_id: z.string().min(1),
  message: z.string().min(3, 'Yanıt en az 3 karakter'),
});

export type TicketFormData = z.infer<typeof ticketSchema>;
export type ReplyFormData = z.infer<typeof replySchema>;
