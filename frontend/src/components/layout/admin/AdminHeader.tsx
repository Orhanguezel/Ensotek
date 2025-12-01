// =============================================================
// FILE: src/components/layout/admin/AdminHeader.tsx
// Ensotek – Admin Header + Notifications Bell
// =============================================================

"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/router";

import {
  useListNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/integrations/rtk/endpoints/notifications.endpoints";

type AdminHeaderProps = {
  onBackHome: () => void;
};

export default function AdminHeader({ onBackHome }: AdminHeaderProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Unread count (badge)
  const { data: unreadData } = useGetUnreadNotificationsCountQuery();
  const unreadCount = unreadData?.count ?? 0;

  // Liste – dropdown açıkken fetch et
  const {
    data: notifications,
    isLoading: isListLoading,
    refetch,
  } = useListNotificationsQuery(
    { limit: 20, offset: 0 },
    { skip: !open },
  );

  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();
  const [markRead] = useMarkNotificationReadMutation();

  // Dışarı tıklayınca dropdown kapansın
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggleDropdown = () => {
    const next = !open;
    setOpen(next);
    // next === true olduğunda hook zaten skip=false ile yeniden subscribe olup fetch edecek
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
      await refetch();
    } catch {
      // şimdilik sessiz; istersen toast ekleyebilirsin
    }
  };

  const handleItemClick = async (id: string, is_read: boolean) => {
    if (!is_read) {
      try {
        await markRead({ id, is_read: true }).unwrap();
        await refetch();
      } catch {
        // ignore
      }
    }
    // ileride bildirim detay sayfası açmak istersen burada router.push ekleyebilirsin
  };

  return (
    <header className="border-bottom bg-white">
      <div className="container-fluid d-flex align-items-center justify-content-between py-2 px-3">
        <div className="fw-semibold small">Ensotek Admin Panel</div>

        <div className="d-flex align-items-center gap-2">
          {/* Bildirim çanı + dropdown */}
          <div className="position-relative" ref={dropdownRef}>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm position-relative"
              onClick={handleToggleDropdown}
            >
              <Bell size={16} className="me-1" />
              <span>Bildirimler</span>
              {unreadCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.65rem" }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div
                className="position-absolute end-0 mt-2"
                style={{ zIndex: 1050, minWidth: 320 }}
              >
                <div className="card shadow-sm">
                  <div className="card-header py-2 d-flex justify-content-between align-items-center">
                    <span className="small fw-semibold">
                      Bildirimler
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      {isListLoading && (
                        <span className="spinner-border spinner-border-sm text-secondary" />
                      )}
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 small"
                        disabled={isMarkingAll || unreadCount === 0}
                        onClick={handleMarkAllRead}
                      >
                        Tümünü okundu yap
                      </button>
                    </div>
                  </div>

                  <div
                    className="list-group list-group-flush"
                    style={{ maxHeight: 360, overflowY: "auto" }}
                  >
                    {!notifications || notifications.length === 0 ? (
                      <div className="list-group-item small text-muted text-center py-3">
                        Bildirim bulunmuyor.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          className={
                            "list-group-item list-group-item-action small text-start " +
                            (!n.is_read ? "fw-semibold" : "")
                          }
                          onClick={() => handleItemClick(n.id, n.is_read)}
                        >
                          <div className="d-flex justify-content-between">
                            <span>{n.title}</span>
                            {!n.is_read && (
                              <span className="badge bg-primary-subtle text-primary">
                                Yeni
                              </span>
                            )}
                          </div>
                          <div className="text-muted mt-1">
                            {n.message.length > 120
                              ? n.message.slice(0, 117) + "..."
                              : n.message}
                          </div>
                          <div className="text-muted mt-1">
                            <small>
                              {new Date(n.created_at).toLocaleString(
                                "tr-TR",
                              )}
                            </small>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="card-footer py-2 d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      En son 20 bildirim listeleniyor.
                    </small>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 small"
                      onClick={() => {
                        setOpen(false);
                        router.push("/admin/site-settings");
                      }}
                    >
                      Site ayarlarına git
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ana sayfa butonu */}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onBackHome}
          >
            ← Ana sayfaya dön
          </button>
        </div>
      </div>
    </header>
  );
}
