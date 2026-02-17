"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Headset, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import {
  useAdminChatMessages,
  useAdminChatThreads,
  useAdminTakeOverThread,
  useCreateOrGetChatThread,
  useChatMessages,
  usePostChatMessage,
  useRequestAdminHandoff,
} from "@/features/chat";
import { useAuthStore } from "@/features/auth/auth.store";
import { useProfile } from "@/features/profiles/profiles.action";

const SUPPORT_CONTEXT_ID_FALLBACK = "11111111-1111-1111-1111-111111111111";
const AI_ASSISTANT_USER_ID = "00000000-0000-0000-0000-00000000a11f";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type AdminQueueFilter = "pending" | "mine" | "all";

function getUserKey(user?: { id?: string | null; email?: string | null }): string {
  const id = String(user?.id ?? "").trim();
  if (id) return `id:${id}`;
  const email = String(user?.email ?? "").trim().toLowerCase();
  if (email) return `email:${email}`;
  return "anon";
}

function supportContextStorageKey(userKey: string): string {
  return `support-chat-context:${userKey}`;
}

function loadOrCreateSupportContextId(userKey: string): string {
  if (typeof window === "undefined") return SUPPORT_CONTEXT_ID_FALLBACK;

  const key = supportContextStorageKey(userKey);
  const existing = String(window.localStorage.getItem(key) ?? "").trim();
  if (UUID_RE.test(existing)) return existing;

  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function isAdminUser(user: any): boolean {
  const roleRaw = String(user?.role ?? "").toLowerCase();
  if (roleRaw === "admin") return true;
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  return roles.some((r: any) => String(r?.role || "").toLowerCase() === "admin");
}

function renderMessageText(raw: string, isMine: boolean) {
  const text = raw.replace("[ADMIN_REQUEST_NOTE] ", "");
  const parts = text.split(/(https?:\/\/[^\s<]+)/g);
  return parts.map((part, idx) => {
    if (/^https?:\/\/[^\s<]+$/.test(part)) {
      return (
        <a
          key={`${part}-${idx}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isMine ? "#ffffff" : "#0a5ea8",
            textDecoration: "underline",
            wordBreak: "break-all",
          }}
        >
          {part}
        </a>
      );
    }
    return <span key={`${idx}-${part.slice(0, 12)}`}>{part}</span>;
  });
}

const copy = {
  tr: {
    title: "Destek Botu",
    subtitle: "AI destek hattı",
    placeholder: "Mesajınızı yazın...",
    send: "Gönder",
    connectAdmin: "Canlı desteğe bağlan",
    connecting: "Bağlanıyor...",
    loginTitle: "Destek hattını kullanmak için giriş yapın.",
    loginButton: "Giriş Yap",
    loading: "Hazırlanıyor...",
    aiMode: "AI aktif",
    adminMode: "Canlı destek talep edildi",
    adminInbox: "Canlı destek kuyruğu",
    noAdminThreads: "Canlı destek talebi bekleniyor.",
    threadLabel: "Talep",
    queueFilterPending: "Atanmamış",
    queueFilterMine: "Bana Atanan",
    queueFilterAll: "Tümü",
    unreadLabel: "yeni mesaj",
    empty: "Merhaba, size nasıl yardımcı olabilirim?",
  },
  en: {
    title: "Support Bot",
    subtitle: "AI support line",
    placeholder: "Type your message...",
    send: "Send",
    connectAdmin: "Connect to live support",
    connecting: "Connecting...",
    loginTitle: "Please login to use support chat.",
    loginButton: "Login",
    loading: "Preparing...",
    aiMode: "AI active",
    adminMode: "Live support requested",
    adminInbox: "Live support inbox",
    noAdminThreads: "No live support requests yet.",
    threadLabel: "Request",
    queueFilterPending: "Unassigned",
    queueFilterMine: "Assigned to me",
    queueFilterAll: "All",
    unreadLabel: "new messages",
    empty: "Hello, how can I help you today?",
  },
  de: {
    title: "Support Bot",
    subtitle: "KI-Support",
    placeholder: "Nachricht eingeben...",
    send: "Senden",
    connectAdmin: "Mit Live-Support verbinden",
    connecting: "Verbinde...",
    loginTitle: "Bitte melden Sie sich an, um den Chat zu nutzen.",
    loginButton: "Anmelden",
    loading: "Wird vorbereitet...",
    aiMode: "KI aktiv",
    adminMode: "Live-Support angefordert",
    adminInbox: "Live-Support Posteingang",
    noAdminThreads: "Noch keine Live-Support-Anfragen.",
    threadLabel: "Anfrage",
    queueFilterPending: "Nicht zugewiesen",
    queueFilterMine: "Mir zugewiesen",
    queueFilterAll: "Alle",
    unreadLabel: "neue Nachrichten",
    empty: "Hallo, wie kann ich Ihnen helfen?",
  },
} as const;

export default function SupportBotWidget() {
  const locale = useLocale();
  const t = copy[(locale as "tr" | "en" | "de") || "tr"] ?? copy.tr;

  const { isAuthenticated, user } = useAuthStore();
  const { data: profile } = useProfile({ enabled: isAuthenticated });
  const roleBasedAdmin = useMemo(() => isAdminUser(user), [user]);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [threadId, setThreadId] = useState<string>("");
  const [handoffMode, setHandoffMode] = useState<"ai" | "admin">("ai");
  const [queueFilter, setQueueFilter] = useState<AdminQueueFilter>("pending");
  const [input, setInput] = useState("");
  const [supportContextId, setSupportContextId] = useState<string>(SUPPORT_CONTEXT_ID_FALLBACK);
  const takenOverThreadsRef = useRef<Set<string>>(new Set());
  const seenByThreadRef = useRef<Record<string, number>>({});
  const prevUnreadRef = useRef(0);
  const userKey = useMemo(() => getUserKey({ id: user?.id, email: user?.email }), [user?.id, user?.email]);

  const createThread = useCreateOrGetChatThread();
  const adminThreadsQuery = useAdminChatThreads(
    { handoff_mode: "admin", limit: 50, offset: 0 },
    { enabled: open && isAuthenticated, refetchInterval: 2_500, retry: false },
  );
  const isAdmin = roleBasedAdmin || (!!adminThreadsQuery.data && !adminThreadsQuery.error);
  const adminCheckPending = open && isAuthenticated && !roleBasedAdmin && adminThreadsQuery.isLoading;
  const userMessagesQuery = useChatMessages(
    threadId,
    { limit: 80 },
    {
      enabled: open && isAuthenticated && !isAdmin && !!threadId,
      refetchInterval: 2_500,
    },
  );
  const adminMessagesQuery = useAdminChatMessages(
    threadId,
    { limit: 80 },
    { enabled: open && isAuthenticated && isAdmin && !!threadId, refetchInterval: 2_500, retry: false },
  );
  const adminTakeOver = useAdminTakeOverThread(threadId);
  const postMessage = usePostChatMessage(threadId);
  const requestAdmin = useRequestAdminHandoff(threadId);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !isAuthenticated || adminCheckPending || isAdmin || threadId || createThread.isPending) return;

    createThread.mutate(
      { context_type: "request", context_id: supportContextId },
      {
        onSuccess: (res) => {
          const mode = (res.thread.handoff_mode as "ai" | "admin") || "ai";
          setThreadId(res.thread.id);
          setHandoffMode(mode);
        },
      },
    );
  }, [open, isAuthenticated, adminCheckPending, isAdmin, threadId, createThread, supportContextId, userKey]);

  const adminThreads = useMemo(() => {
    const rows = adminThreadsQuery.data?.items ?? [];
    return rows
      .map((item: any) => (item?.thread ? item.thread : item))
      .filter((item: any) => item?.id)
      .sort((a: any, b: any) => {
        const aPending = !a?.assigned_admin_user_id ? 1 : 0;
        const bPending = !b?.assigned_admin_user_id ? 1 : 0;
        if (aPending !== bPending) return bPending - aPending;
        return new Date(b?.updated_at ?? 0).getTime() - new Date(a?.updated_at ?? 0).getTime();
      });
  }, [adminThreadsQuery.data?.items]);

  const filteredAdminThreads = useMemo(() => {
    const me = String(user?.id ?? "");
    if (queueFilter === "all") return adminThreads;
    if (queueFilter === "mine") {
      return adminThreads.filter((th: any) => String(th?.assigned_admin_user_id ?? "") === me);
    }
    return adminThreads.filter((th: any) => !th?.assigned_admin_user_id);
  }, [adminThreads, queueFilter, user?.id]);

  const unreadCount = useMemo(() => {
    return filteredAdminThreads.reduce((acc: number, th: any) => {
      const updated = new Date(th?.updated_at ?? 0).getTime();
      const seen = Number(seenByThreadRef.current[th.id] ?? 0);
      return acc + (updated > seen ? 1 : 0);
    }, 0);
  }, [filteredAdminThreads, adminThreadsQuery.data?.items]);

  useEffect(() => {
    if (!open || !isAuthenticated || !isAdmin) return;
    const first = filteredAdminThreads[0];
    if (!first) {
      setThreadId("");
      setHandoffMode("admin");
      return;
    }
    const exists = filteredAdminThreads.some((t: any) => t.id === threadId);
    if (!threadId || !exists) {
      setThreadId(first.id);
      setHandoffMode("admin");
    }
  }, [open, isAuthenticated, isAdmin, filteredAdminThreads, threadId]);

  useEffect(() => {
    if (!isAdmin || !threadId || takenOverThreadsRef.current.has(threadId)) return;
    takenOverThreadsRef.current.add(threadId);
    adminTakeOver.mutate(undefined, {
      onError: () => {
        takenOverThreadsRef.current.delete(threadId);
      },
    });
  }, [isAdmin, threadId, adminTakeOver]);

  useEffect(() => {
    if (!isAuthenticated) {
      takenOverThreadsRef.current.clear();
      setSupportContextId(SUPPORT_CONTEXT_ID_FALLBACK);
      setThreadId("");
      setHandoffMode("ai");
      return;
    }
    takenOverThreadsRef.current.clear();
    if (isAdmin) {
      setThreadId("");
      setHandoffMode("admin");
      return;
    }
    setSupportContextId(loadOrCreateSupportContextId(userKey));
    setThreadId("");
    setHandoffMode("ai");
  }, [isAuthenticated, isAdmin, userKey]);

  useEffect(() => {
    if (!isAdmin) return;
    if (typeof window === "undefined") return;
    const key = `support-chat-seen:${userKey}`;
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) ?? "{}") as Record<string, number>;
      seenByThreadRef.current = parsed || {};
    } catch {
      seenByThreadRef.current = {};
    }
  }, [isAdmin, userKey]);

  useEffect(() => {
    if (!isAdmin || !threadId) return;
    const current = adminThreads.find((th: any) => th.id === threadId);
    if (!current) return;
    const stamp = new Date(current.updated_at ?? 0).getTime();
    if (!stamp) return;
    seenByThreadRef.current[threadId] = stamp;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`support-chat-seen:${userKey}`, JSON.stringify(seenByThreadRef.current));
    }
  }, [isAdmin, threadId, adminThreads, userKey, adminMessagesQuery.data?.items?.length]);

  useEffect(() => {
    if (!isAdmin || !open) return;
    if (unreadCount <= prevUnreadRef.current) {
      prevUnreadRef.current = unreadCount;
      return;
    }
    prevUnreadRef.current = unreadCount;
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      setTimeout(() => ctx.close?.(), 150);
    } catch {
      // no-op
    }
  }, [isAdmin, open, unreadCount]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [userMessagesQuery.data?.items?.length, adminMessagesQuery.data?.items?.length, open]);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const items = (isAdmin ? adminMessagesQuery.data?.items : userMessagesQuery.data?.items) ?? [];
  const canSend =
    isAuthenticated &&
    !!threadId &&
    input.trim().length > 0 &&
    !postMessage.isPending &&
    (!isAdmin || !adminTakeOver.isPending);
  const statusText = isAdmin ? t.adminInbox : handoffMode === "admin" ? t.adminMode : t.aiMode;
  const displayName = user?.full_name?.trim() || user?.email?.split("@")[0] || "User";
  const myAvatar = profile?.avatar_url || null;

  const headerGradient = useMemo(
    () =>
      isAdmin
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
        : "linear-gradient(135deg, #0f4c81 0%, #0a84d8 100%)",
    [isAdmin],
  );

  const handleSend = () => {
    const text = input.trim();
    if (!text || !threadId) return;
    setInput("");
    postMessage.mutate({ text, client_id: crypto.randomUUID() });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Support chat"
        style={{
          position: "fixed",
          left: isMobile ? 12 : 22,
          bottom: isMobile ? 12 : 22,
          width: isMobile ? 56 : 62,
          height: isMobile ? 56 : 62,
          borderRadius: isAdmin ? 14 : "50%",
          border: "none",
          zIndex: 9999,
          background: headerGradient,
          color: "#fff",
          boxShadow: isAdmin ? "0 18px 40px rgba(15,23,42,0.35)" : "0 18px 40px rgba(10,132,216,0.35)",
          display: "grid",
          placeItems: "center",
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05) translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? <X size={24} /> : <MessageCircle size={26} />}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            left: isMobile ? 8 : 22,
            right: isMobile ? 8 : "auto",
            bottom: isMobile ? "calc(env(safe-area-inset-bottom, 0px) + 76px)" : 94,
            width: isMobile ? "auto" : isAdmin ? "min(460px, calc(100vw - 24px))" : "min(360px, calc(100vw - 24px))",
            height: isMobile ? "min(560px, calc(100dvh - 140px))" : isAdmin ? 620 : 520,
            borderRadius: isMobile ? 14 : isAdmin ? 12 : 18,
            background: "#fff",
            zIndex: 9999,
            boxShadow: isAdmin ? "0 26px 80px rgba(15,23,42,0.32)" : "0 24px 70px rgba(0,0,0,0.2)",
            overflow: "hidden",
            border: isAdmin ? "1px solid rgba(15,23,42,0.2)" : "1px solid rgba(15,76,129,0.12)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ background: headerGradient, color: "#fff", padding: isAdmin ? "12px 14px" : "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {isAdmin ? <Headset size={18} /> : <Bot size={18} />}
                <strong>{isAdmin ? t.adminInbox : t.title}</strong>
              </div>
              {isAdmin ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.24)",
                    borderRadius: 999,
                    padding: "4px 8px 4px 4px",
                    maxWidth: 190,
                  }}
                >
                  {myAvatar ? (
                    <Image
                      src={myAvatar}
                      alt={displayName}
                      width={24}
                      height={24}
                      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.24)",
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(displayName) || "AD"}
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={displayName}
                  >
                    {displayName}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: 12, opacity: 0.92 }}>{statusText}</span>
              )}
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
              {isAdmin ? `${statusText}${unreadCount ? ` • ${unreadCount} ${t.unreadLabel}` : ""}` : t.subtitle}
            </div>
          </div>

          {!isAuthenticated ? (
            <div style={{ padding: 18 }}>
              <p style={{ marginBottom: 12 }}>{t.loginTitle}</p>
              <Link href="/login" className="solid__btn" style={{ width: "100%", textAlign: "center" }}>
                {t.loginButton}
              </Link>
            </div>
          ) : (
            <>
              {isAdmin && (
                <div
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid #e8edf3",
                    background: "#f7fbff",
                  }}
                >
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <button
                      type="button"
                      onClick={() => setQueueFilter("pending")}
                      style={{
                        border: "1px solid #cdd8e5",
                        background: queueFilter === "pending" ? "#0a84d8" : "#fff",
                        color: queueFilter === "pending" ? "#fff" : "#20415f",
                        borderRadius: 999,
                        fontSize: 11,
                        padding: "4px 8px",
                      }}
                    >
                      {t.queueFilterPending}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQueueFilter("mine")}
                      style={{
                        border: "1px solid #cdd8e5",
                        background: queueFilter === "mine" ? "#0a84d8" : "#fff",
                        color: queueFilter === "mine" ? "#fff" : "#20415f",
                        borderRadius: 999,
                        fontSize: 11,
                        padding: "4px 8px",
                      }}
                    >
                      {t.queueFilterMine}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQueueFilter("all")}
                      style={{
                        border: "1px solid #cdd8e5",
                        background: queueFilter === "all" ? "#0a84d8" : "#fff",
                        color: queueFilter === "all" ? "#fff" : "#20415f",
                        borderRadius: 999,
                        fontSize: 11,
                        padding: "4px 8px",
                      }}
                    >
                      {t.queueFilterAll}
                    </button>
                  </div>
                  <select
                    value={threadId}
                    onChange={(e) => {
                      setThreadId(e.target.value);
                      setHandoffMode("admin");
                    }}
                    style={{
                      width: "100%",
                      border: "1px solid #d7e0ea",
                      borderRadius: 8,
                      padding: "8px 10px",
                      fontSize: 12,
                      color: "#12314f",
                      background: "#fff",
                    }}
                  >
                    {filteredAdminThreads.length === 0 && <option value="">{t.noAdminThreads}</option>}
                    {filteredAdminThreads.map((th: any) => {
                      const updated = new Date(th?.updated_at ?? 0).getTime();
                      const seen = Number(seenByThreadRef.current[th.id] ?? 0);
                      const hasUnread = updated > seen;
                      return (
                      <option key={th.id} value={th.id}>
                        {hasUnread ? "● " : ""}
                        {t.threadLabel}: {String(th.context_id || "").slice(0, 8)} |{" "}
                        {new Date(th.updated_at).toLocaleString()}
                      </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div
                ref={listRef}
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  padding: 14,
                  background: "linear-gradient(180deg, #f9fcff 0%, #f3f7fb 100%)",
                }}
              >
                {!threadId ? (
                  <div style={{ fontSize: 13, color: "#5c6b7a" }}>
                    {isAdmin ? t.noAdminThreads : t.loading}
                  </div>
                ) : !isAdmin && createThread.isPending ? (
                  <div style={{ fontSize: 13, color: "#5c6b7a" }}>{t.loading}</div>
                ) : items.length === 0 ? (
                  <div
                    style={{
                      background: "#eaf4ff",
                      color: "#113554",
                      padding: "10px 12px",
                      borderRadius: 10,
                      width: "85%",
                      fontSize: 13,
                    }}
                  >
                    {t.empty}
                  </div>
                ) : (
                  items.map((m) => {
                    const isMine = m.sender_user_id === user?.id;
                    const isAi = m.sender_user_id === AI_ASSISTANT_USER_ID;
                    const bubbleBg = isMine ? "#0a84d8" : isAi ? "#eaf4ff" : "#edf0f5";
                    const bubbleFg = isMine ? "#fff" : "#13202c";
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                          alignItems: "flex-end",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        {!isMine && (
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: isAi ? "#0a84d8" : "#c7d3df",
                              color: "#fff",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 11,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                            title={isAi ? "AI" : "User"}
                          >
                            {isAi ? "AI" : "U"}
                          </div>
                        )}
                        <div
                          style={{
                            maxWidth: "86%",
                            padding: "10px 12px",
                            borderRadius: isMine ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                            fontSize: 13,
                            lineHeight: 1.4,
                            background: bubbleBg,
                            color: bubbleFg,
                          }}
                        >
                          {renderMessageText(m.text, isMine)}
                        </div>
                        {isMine && myAvatar && (
                          <Image
                            src={myAvatar}
                            alt={displayName}
                            width={26}
                            height={26}
                            style={{
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1px solid rgba(15,76,129,0.12)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        {isMine && !myAvatar && (
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: "#0f4c81",
                              color: "#fff",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 10,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(displayName) || "ME"}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <div
                style={{
                  padding: "10px 12px",
                  borderTop: "1px solid #e8edf3",
                  background: "#fff",
                }}
              >
                {!isAdmin && (
                  <button
                    type="button"
                    onClick={() =>
                      requestAdmin.mutate(undefined, {
                        onSuccess: (res) => {
                          if (res.thread?.handoff_mode) {
                            setHandoffMode(res.thread.handoff_mode);
                          } else {
                            setHandoffMode("admin");
                          }
                        },
                      })
                    }
                    disabled={!threadId || requestAdmin.isPending || handoffMode === "admin"}
                    style={{
                      width: "100%",
                      border: "1px solid #0a84d8",
                      color: "#0a84d8",
                      background: "#fff",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginBottom: 10,
                      opacity: !threadId || handoffMode === "admin" ? 0.65 : 1,
                    }}
                  >
                    <Headset size={14} />
                    {requestAdmin.isPending ? t.connecting : t.connectAdmin}
                  </button>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={t.placeholder}
                    style={{
                      flex: 1,
                      border: "1px solid #d7e0ea",
                      borderRadius: 10,
                      padding: "10px 12px",
                      fontSize: 13,
                      minHeight: 40,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!canSend}
                    style={{
                      border: "none",
                      borderRadius: 10,
                      padding: "0 12px",
                      minWidth: 46,
                      background: "#0a84d8",
                      color: "#fff",
                      opacity: canSend ? 1 : 0.6,
                    }}
                    aria-label={t.send}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
