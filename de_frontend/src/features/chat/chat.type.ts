export type ChatContextType = "job" | "request";
export type ChatRole = "buyer" | "vendor" | "admin";
export type ChatHandoffMode = "ai" | "admin";
export type ChatAiProvider = "auto" | "openai" | "anthropic" | "grok";

export interface ChatThread {
  id: string;
  context_type: ChatContextType;
  context_id: string;
  handoff_mode: ChatHandoffMode;
  ai_provider_preference: ChatAiProvider;
  assigned_admin_user_id: string | null;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: string;
  thread_id: string;
  user_id: string;
  role: ChatRole;
  joined_at: string;
  last_read_at: string | null;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  sender_user_id: string;
  client_id: string | null;
  text: string;
  created_at: string;
}

export interface ChatUserThreadListItem {
  thread: ChatThread;
  participant: ChatParticipant;
}

export type ChatThreadListItem = ChatThread | ChatUserThreadListItem;

export interface ChatListThreadsParams {
  context_type?: ChatContextType;
  context_id?: string;
  handoff_mode?: ChatHandoffMode;
  limit?: number;
  offset?: number;
}

export interface ChatListMessagesParams {
  limit?: number;
  before?: string;
}

export interface CreateOrGetChatThreadRequest {
  context_type: ChatContextType;
  context_id: string;
}

export interface PostChatMessageRequest {
  text: string;
  client_id?: string;
}

export interface RequestAdminHandoffRequest {
  note?: string;
}

export interface ChatThreadsResponse {
  items: ChatThreadListItem[];
}

export interface ChatMessagesResponse {
  items: ChatMessage[];
}

export interface CreateOrGetChatThreadResponse {
  thread: ChatThread;
}

export interface PostChatMessageResponse {
  message: ChatMessage;
}

export interface RequestAdminHandoffResponse {
  thread: ChatThread | null;
}

