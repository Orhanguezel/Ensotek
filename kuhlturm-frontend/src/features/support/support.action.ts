import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { supportService } from './support.service';
import type { CreateTicketRequest, CreateReplyRequest, UpdateTicketRequest } from './support.type';

export function useTickets() {
  return useQuery({
    queryKey: queryKeys.support.tickets(),
    queryFn: supportService.getTickets,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.support.ticket(id),
    queryFn: () => supportService.getTicket(id),
    enabled: !!id,
  });
}

export function useTicketReplies(ticketId: string) {
  return useQuery({
    queryKey: queryKeys.support.replies(ticketId),
    queryFn: () => supportService.getReplies(ticketId),
    enabled: !!ticketId,
    refetchInterval: 15_000,  // poll for new replies
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketRequest) => supportService.createTicket(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.support.all }); },
  });
}

export function useUpdateTicket(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTicketRequest) => supportService.updateTicket(ticketId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.support.ticket(ticketId) });
      qc.invalidateQueries({ queryKey: queryKeys.support.tickets() });
    },
  });
}

export function useAddReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReplyRequest) => supportService.addReply(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.support.replies(variables.ticket_id) });
    },
  });
}
