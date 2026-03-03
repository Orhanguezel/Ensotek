import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import { chatService } from "./chat.service";
import type {
  ChatAiProvider,
  ChatListMessagesParams,
  ChatListThreadsParams,
  CreateOrGetChatThreadRequest,
  PostChatMessageRequest,
  RequestAdminHandoffRequest,
} from "./chat.type";

export function useChatThreads(params?: ChatListThreadsParams) {
  return useQuery({
    queryKey: queryKeys.chat.threads(params as Record<string, unknown> | undefined),
    queryFn: () => chatService.listThreads(params),
  });
}

export function useCreateOrGetChatThread() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrGetChatThreadRequest) => chatService.createOrGetThread(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.chat.all });
    },
  });
}

export function useChatMessages(
  threadId: string,
  params?: ChatListMessagesParams,
  options?: { enabled?: boolean; refetchInterval?: number },
) {
  const enabled = !!threadId && (options?.enabled ?? true);
  const refetchInterval = options?.refetchInterval ?? 3_000;

  return useQuery({
    queryKey: queryKeys.chat.messages(threadId, params as Record<string, unknown> | undefined),
    queryFn: () => chatService.listMessages(threadId, params),
    enabled,
    refetchInterval: enabled ? refetchInterval : false,
  });
}

export function usePostChatMessage(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PostChatMessageRequest) => chatService.postMessage(threadId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.chat.messages(threadId) });
      qc.invalidateQueries({ queryKey: queryKeys.chat.threads() });
      qc.invalidateQueries({ queryKey: queryKeys.chatAdmin.threads() });
    },
  });
}

export function useRequestAdminHandoff(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data?: RequestAdminHandoffRequest) => chatService.requestAdminHandoff(threadId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.chat.messages(threadId) });
      qc.invalidateQueries({ queryKey: queryKeys.chat.threads() });
      qc.invalidateQueries({ queryKey: queryKeys.chatAdmin.threads() });
    },
  });
}

export function useAdminChatThreads(
  params?: ChatListThreadsParams,
  options?: { enabled?: boolean; refetchInterval?: number; retry?: boolean | number },
) {
  const enabled = options?.enabled ?? true;
  const refetchInterval = options?.refetchInterval ?? 3_000;
  const retry = options?.retry ?? false;
  return useQuery({
    queryKey: queryKeys.chatAdmin.threads(params as Record<string, unknown> | undefined),
    queryFn: () => chatService.adminListThreads(params),
    enabled,
    refetchInterval: enabled ? refetchInterval : false,
    retry,
  });
}

export function useAdminChatMessages(
  threadId: string,
  params?: ChatListMessagesParams,
  options?: { enabled?: boolean; refetchInterval?: number; retry?: boolean | number },
) {
  const enabled = !!threadId && (options?.enabled ?? true);
  const refetchInterval = options?.refetchInterval ?? 3_000;
  const retry = options?.retry ?? false;
  return useQuery({
    queryKey: queryKeys.chatAdmin.messages(threadId, params as Record<string, unknown> | undefined),
    queryFn: () => chatService.adminListMessages(threadId, params),
    enabled,
    refetchInterval: enabled ? refetchInterval : false,
    retry,
  });
}

export function useAdminTakeOverThread(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (adminUserId?: string) => chatService.adminTakeOverThread(threadId, adminUserId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.chatAdmin.all });
      qc.invalidateQueries({ queryKey: queryKeys.chat.all });
    },
  });
}

export function useAdminReleaseToAi(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (provider?: ChatAiProvider) => chatService.adminReleaseToAi(threadId, provider),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.chatAdmin.all });
      qc.invalidateQueries({ queryKey: queryKeys.chat.all });
    },
  });
}

export function useAdminSetAiProvider(threadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (provider: ChatAiProvider) => chatService.adminSetAiProvider(threadId, provider),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.chatAdmin.all });
      qc.invalidateQueries({ queryKey: queryKeys.chat.all });
    },
  });
}
