export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  replies?: TicketReply[];
}

export interface TicketReply {
    id: string;
    message: string;
    sender: 'user' | 'support';
    created_at: string;
}

export const supportService = {
  getAll: async (): Promise<Ticket[]> => {
    return [];
  },
  getById: async (id: string): Promise<Ticket> => {
      return { id, subject: 'Ticket', status: 'open', created_at: new Date().toISOString() };
  },
  create: async (data: TicketFormData): Promise<Ticket> => {
      return { id: '1', subject: data.subject, status: 'open', created_at: new Date().toISOString() };
  },
  reply: async (id: string, message: string): Promise<TicketReply> => {
      return { id: '1', message, sender: 'user', created_at: new Date().toISOString() };
  }
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

export const ticketSchema = z.object({
    subject: z.string().min(1, 'Konu gereklidir'),
    message: z.string().min(1, 'Mesaj gereklidir'),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

export const useTickets = () => {
    return useQuery({
        queryKey: ['tickets'],
        queryFn: supportService.getAll,
        initialData: []
    });
};

export const useTicket = (id: string) => {
    return useQuery({
        queryKey: ['tickets', id],
        queryFn: () => supportService.getById(id),
        enabled: !!id
    });
};

export const useTicketReplies = (_id: string) => {
    // Assuming ticket query includes replies or separate enpoint
    return { data: [] }; 
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: supportService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        }
    });
};

export const useAddReply = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, message }: { id: string; message: string }) => supportService.reply(id, message),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
        }
    });
};
