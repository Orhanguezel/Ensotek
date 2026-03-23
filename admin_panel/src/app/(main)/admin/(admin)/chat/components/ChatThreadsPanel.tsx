// =============================================================
// FILE: src/app/(main)/admin/(admin)/chat/components/ChatThreadsPanel.tsx
// Chat Threads list + inline message panel
// Ensotek
// =============================================================

"use client";

import * as React from "react";

import { Bot, RefreshCw, Send, User } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/useAdminT";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useListChatMessagesAdminQuery,
  useListChatThreadsAdminQuery,
  usePostChatMessageAdminMutation,
  useReleaseToAiChatThreadAdminMutation,
  useSetAiProviderChatThreadAdminMutation,
  useTakeOverChatThreadAdminMutation,
} from "@/integrations/hooks";
import type { ChatAiProvider, ChatHandoffMode, ChatListThreadsParams, ChatThread } from "@/integrations/shared";

function toLocalDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString();
}

// ─── Thread list ────────────────────────────────────────────

function ThreadItem({ thread, isActive, onClick }: { thread: ChatThread; isActive: boolean; onClick: () => void }) {
  const t = useAdminT("admin.chat");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md border p-3 text-left transition-colors ${
        isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium text-xs">
          {thread.context_type}/{thread.context_id?.slice(0, 8)}
        </span>
        <Badge variant={thread.handoff_mode === "admin" ? "default" : "secondary"} className="text-[10px]">
          {thread.handoff_mode === "admin" ? t("threads.modeAdmin") : t("threads.modeAi")}
        </Badge>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{toLocalDate(thread.updated_at)}</p>
    </button>
  );
}

// ─── Message panel ──────────────────────────────────────────

function MessagePanel({ thread }: { thread: ChatThread }) {
  const t = useAdminT("admin.chat");
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const handler = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const { data, isFetching, refetch } = useListChatMessagesAdminQuery(
    { threadId: thread.id },
    { pollingInterval: tabVisible ? 10000 : 0 },
  );
  const [postMsg, { isLoading: sending }] = usePostChatMessageAdminMutation();
  const [takeover] = useTakeOverChatThreadAdminMutation();
  const [releaseToAi] = useReleaseToAiChatThreadAdminMutation();
  const [setProvider] = useSetAiProviderChatThreadAdminMutation();

  const [text, setText] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const messages = data?.items ?? [];

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      await postMsg({
        threadId: thread.id,
        body: { text: trimmed, client_id: crypto.randomUUID() },
      }).unwrap();
      setText("");
    } catch {
      toast.error(t("messages.sendError"));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTakeover = async () => {
    try {
      await takeover({ threadId: thread.id }).unwrap();
      toast.success(t("threads.takeoverSuccess"));
    } catch {
      toast.error(t("threads.takeoverError"));
    }
  };

  const handleRelease = async () => {
    try {
      await releaseToAi({ threadId: thread.id }).unwrap();
      toast.success(t("threads.releaseSuccess"));
    } catch {
      toast.error(t("threads.releaseError"));
    }
  };

  const handleProviderChange = async (provider: string) => {
    try {
      await setProvider({
        threadId: thread.id,
        body: { provider: provider as ChatAiProvider },
      }).unwrap();
      toast.success(t("threads.providerChanged"));
    } catch {
      toast.error(t("threads.providerError"));
    }
  };

  return (
    <Card className="flex h-full flex-col">
      {/* Header with actions */}
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            {thread.context_type}/{thread.context_id?.slice(0, 8)}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {thread.handoff_mode === "ai" ? (
            <Button size="sm" variant="outline" onClick={handleTakeover}>
              {t("threads.takeover")}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleRelease}>
              {t("threads.releaseToAi")}
            </Button>
          )}

          <Select value={thread.ai_provider_preference} onValueChange={handleProviderChange}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
              <SelectItem value="grok">Grok</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant={thread.handoff_mode === "admin" ? "default" : "secondary"}>
            {thread.handoff_mode === "admin" ? t("threads.modeAdmin") : t("threads.modeAi")}
          </Badge>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex min-h-0 flex-1 flex-col pt-0">
        <ScrollArea className="mb-3 flex-1 pr-3" style={{ maxHeight: "calc(100vh - 420px)" }}>
          <div className="space-y-2">
            {messages.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">{t("messages.noMessages")}</p>
            ) : (
              messages.map((msg) => {
                const isSystem = msg.sender_user_id === "system" || msg.sender_user_id === "ai";
                return (
                  <div key={msg.id} className={`flex gap-2 ${isSystem ? "" : "justify-end"}`}>
                    {isSystem && (
                      <div className="mt-1 shrink-0">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        isSystem ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      <p className="mt-1 text-[10px] opacity-60">{toLocalDate(msg.created_at)}</p>
                    </div>
                    {!isSystem && (
                      <div className="mt-1 shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("messages.placeholder")}
            disabled={sending}
          />
          <Button size="icon" onClick={handleSend} disabled={sending || !text.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main ───────────────────────────────────────────────────

export default function ChatThreadsPanel() {
  const t = useAdminT("admin.chat");

  const [handoffFilter, setHandoffFilter] = React.useState<ChatHandoffMode | "all">("all");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const handler = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const params: ChatListThreadsParams = React.useMemo(() => {
    const p: ChatListThreadsParams = { limit: 50 };
    if (handoffFilter !== "all") p.handoff_mode = handoffFilter;
    return p;
  }, [handoffFilter]);

  const { data, isFetching, refetch } = useListChatThreadsAdminQuery(params, {
    pollingInterval: tabVisible ? 15000 : 0,
  });

  const threads = data?.items ?? [];
  const selected = threads.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]" style={{ minHeight: "60vh" }}>
      {/* Left — Thread list */}
      <Card className="flex flex-col">
        <CardHeader className="space-y-2 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{t("threads.title")}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <Select value={handoffFilter} onValueChange={(v) => setHandoffFilter(v as ChatHandoffMode | "all")}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("threads.filterAll")}</SelectItem>
              <SelectItem value="ai">{t("threads.filterAi")}</SelectItem>
              <SelectItem value="admin">{t("threads.filterAdmin")}</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {threads.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground text-sm">{t("threads.noThreads")}</p>
          ) : (
            <div className="space-y-2">
              {threads.map((thread) => (
                <ThreadItem
                  key={thread.id}
                  thread={thread}
                  isActive={thread.id === selectedId}
                  onClick={() => setSelectedId(thread.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right — Messages */}
      {selected ? (
        <MessagePanel thread={selected} />
      ) : (
        <Card className="flex items-center justify-center">
          <p className="text-muted-foreground text-sm">{t("threads.selectThread")}</p>
        </Card>
      )}
    </div>
  );
}
