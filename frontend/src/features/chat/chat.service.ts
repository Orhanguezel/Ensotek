import api from "@/lib/axios";
import type {
  ChatAiProvider,
  ChatListMessagesParams,
  ChatListThreadsParams,
  ChatMessagesResponse,
  ChatThreadsResponse,
  CreateOrGetChatThreadRequest,
  CreateOrGetChatThreadResponse,
  PostChatMessageRequest,
  PostChatMessageResponse,
  RequestAdminHandoffRequest,
  RequestAdminHandoffResponse,
} from "./chat.type";

export const chatService = {
  listThreads: async (params?: ChatListThreadsParams): Promise<ChatThreadsResponse> => {
    const response = await api.get<ChatThreadsResponse>("/chat/threads", { params });
    return response.data;
  },

  createOrGetThread: async (
    data: CreateOrGetChatThreadRequest,
  ): Promise<CreateOrGetChatThreadResponse> => {
    const response = await api.post<CreateOrGetChatThreadResponse>("/chat/threads", data);
    return response.data;
  },

  listMessages: async (
    threadId: string,
    params?: ChatListMessagesParams,
  ): Promise<ChatMessagesResponse> => {
    const response = await api.get<ChatMessagesResponse>(`/chat/threads/${threadId}/messages`, {
      params,
    });
    return response.data;
  },

  postMessage: async (
    threadId: string,
    data: PostChatMessageRequest,
  ): Promise<PostChatMessageResponse> => {
    const response = await api.post<PostChatMessageResponse>(
      `/chat/threads/${threadId}/messages`,
      data,
    );
    return response.data;
  },

  requestAdminHandoff: async (
    threadId: string,
    data?: RequestAdminHandoffRequest,
  ): Promise<RequestAdminHandoffResponse> => {
    const response = await api.post<RequestAdminHandoffResponse>(
      `/chat/threads/${threadId}/request-admin`,
      data ?? {},
    );
    return response.data;
  },

  adminListThreads: async (params?: ChatListThreadsParams): Promise<ChatThreadsResponse> => {
    const response = await api.get<ChatThreadsResponse>("/admin/chat/threads", { params });
    return response.data;
  },

  adminListMessages: async (
    threadId: string,
    params?: ChatListMessagesParams,
  ): Promise<ChatMessagesResponse> => {
    const response = await api.get<ChatMessagesResponse>(`/admin/chat/threads/${threadId}/messages`, {
      params,
    });
    return response.data;
  },

  adminTakeOverThread: async (
    threadId: string,
    admin_user_id?: string,
  ): Promise<RequestAdminHandoffResponse> => {
    const response = await api.post<RequestAdminHandoffResponse>(
      `/admin/chat/threads/${threadId}/takeover`,
      admin_user_id ? { admin_user_id } : {},
    );
    return response.data;
  },

  adminReleaseToAi: async (
    threadId: string,
    provider?: ChatAiProvider,
  ): Promise<RequestAdminHandoffResponse> => {
    const response = await api.post<RequestAdminHandoffResponse>(
      `/admin/chat/threads/${threadId}/release-to-ai`,
      provider ? { provider } : {},
    );
    return response.data;
  },

  adminSetAiProvider: async (
    threadId: string,
    provider: ChatAiProvider,
  ): Promise<RequestAdminHandoffResponse> => {
    const response = await api.patch<RequestAdminHandoffResponse>(
      `/admin/chat/threads/${threadId}/ai-provider`,
      { provider },
    );
    return response.data;
  },
};

