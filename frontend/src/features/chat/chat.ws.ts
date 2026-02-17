import type { ChatMessage } from "./chat.type";

export type ChatWsServerEvent =
  | { type: "hello"; thread_id: string }
  | { type: "message"; message: ChatMessage }
  | { type: "ack"; client_id: string; message_id: string; created_at: string }
  | { type: "ai_meta"; provider: string; model: string; thread_id: string }
  | { type: "handoff_requested"; thread_id: string; requested_by_user_id: string }
  | { type: "error"; code: string };

export type ChatWsClientMessage = {
  type: "message";
  text: string;
  client_id: string;
};

function resolveWsBaseUrl() {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  if (apiUrl) {
    const url = new URL(apiUrl);
    const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${wsProtocol}//${url.host}`;
  }
  if (typeof window !== "undefined") {
    return window.location.origin.replace(/^http/, "ws");
  }
  return "ws://localhost:8086";
}

export function buildChatWsUrl(threadId: string): string {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  let apiPath = "/api";

  if (apiUrl) {
    const parsed = new URL(apiUrl);
    apiPath = parsed.pathname.endsWith("/api") ? parsed.pathname : `${parsed.pathname}/api`;
  }

  const path = `${apiPath}/chat/ws?thread_id=${encodeURIComponent(threadId)}`;
  return `${resolveWsBaseUrl()}${path}`;
}

export class ChatWsClient {
  private socket: WebSocket | null = null;

  constructor(
    private readonly threadId: string,
    private readonly onEvent: (event: ChatWsServerEvent) => void,
  ) {}

  connect() {
    if (this.socket) return;
    const ws = new WebSocket(buildChatWsUrl(this.threadId));
    this.socket = ws;

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(String(event.data)) as ChatWsServerEvent;
        this.onEvent(parsed);
      } catch {
        this.onEvent({ type: "error", code: "invalid_ws_payload" });
      }
    };

    ws.onclose = () => {
      this.socket = null;
    };

    ws.onerror = () => {
      this.onEvent({ type: "error", code: "ws_error" });
    };
  }

  sendMessage(payload: ChatWsClientMessage) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return false;
    this.socket.send(JSON.stringify(payload));
    return true;
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.close();
    this.socket = null;
  }
}

