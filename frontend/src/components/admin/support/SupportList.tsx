// =============================================================
// FILE: src/components/admin/support/SupportList.tsx
// Ensotek – Admin Support Tickets Table
// =============================================================

import React from "react";
import { useRouter } from "next/router";
import type { AdminSupportTicketDto } from "@/integrations/types/support.types";

export type SupportListProps = {
  items: AdminSupportTicketDto[];
  loading: boolean;
};

const fmtDate = (value: string | null | undefined) => {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("tr-TR");
  } catch {
    return value;
  }
};

const statusBadge = (status: AdminSupportTicketDto["status"]) => {
  switch (status) {
    case "open":
      return (
        <span className="badge bg-success-subtle text-success">Açık</span>
      );
    case "in_progress":
      return (
        <span className="badge bg-info-subtle text-info">İşlemde</span>
      );
    case "waiting_response":
      return (
        <span className="badge bg-warning-subtle text-warning">
          Yanıt Bekleniyor
        </span>
      );
    case "closed":
      return (
        <span className="badge bg-secondary-subtle text-muted">Kapalı</span>
      );
    default:
      return (
        <span className="badge bg-light text-muted">{status}</span>
      );
  }
};

const priorityBadge = (priority: AdminSupportTicketDto["priority"]) => {
  switch (priority) {
    case "low":
      return (
        <span className="badge bg-secondary-subtle text-muted">
          Düşük
        </span>
      );
    case "medium":
      return (
        <span className="badge bg-primary-subtle text-primary">
          Orta
        </span>
      );
    case "high":
      return (
        <span className="badge bg-warning-subtle text-warning">
          Yüksek
        </span>
      );
    case "urgent":
      return (
        <span className="badge bg-danger-subtle text-danger">
          Acil
        </span>
      );
    default:
      return (
        <span className="badge bg-light text-muted">{priority}</span>
      );
  }
};

export const SupportList: React.FC<SupportListProps> = ({
  items,
  loading,
}) => {
  const router = useRouter();

  const handleRowClick = (item: AdminSupportTicketDto) => {
    router.push(`/admin/support/${encodeURIComponent(item.id)}`);
  };

  if (!loading && items.length === 0) {
    return (
      <div className="card">
        <div className="card-body py-4 text-center text-muted small">
          Henüz kayıtlı bir destek talebi yok.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-sm align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: "24px" }}>#</th>
              <th>Konu</th>
              <th>Kullanıcı ID</th>
              <th>Durum</th>
              <th>Öncelik</th>
              <th>Oluşturulma</th>
              <th>Son Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t, idx) => (
              <tr
                key={t.id}
                onClick={() => handleRowClick(t)}
                style={{ cursor: "pointer" }}
              >
                <td className="text-muted small">{idx + 1}</td>
                <td className="fw-semibold">
                  {t.subject.length > 80
                    ? `${t.subject.slice(0, 80)}…`
                    : t.subject}
                </td>
                <td className="text-muted small">{t.user_id}</td>
                <td>{statusBadge(t.status)}</td>
                <td>{priorityBadge(t.priority)}</td>
                <td className="text-muted small">
                  {fmtDate(t.created_at)}
                </td>
                <td className="text-muted small">
                  {fmtDate(t.updated_at)}
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-3 text-muted small"
                >
                  Yükleniyor...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
