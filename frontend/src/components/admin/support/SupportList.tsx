// =============================================================
// FILE: src/components/admin/support/SupportList.tsx
// Ensotek – Admin Support Tickets List (Responsive)
// - < xxl: CARDS (tablet + mobile)
// - xxl+: TABLE (scroll-free: table-layout fixed + truncation)
// =============================================================

'use client';

import React from 'react';
import { useRouter } from 'next/router';
import type { AdminSupportTicketDto } from '@/integrations/types/support.types';

/* ---------------- Helpers ---------------- */

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));

const fmtDate = (value: string | null | undefined) => {
  if (!value) return '-';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString('tr-TR');
  } catch {
    return String(value);
  }
};

const formatText = (v: unknown, max = 90) => {
  const s = safeText(v).trim();
  if (!s) return '-';
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + '…';
};

const statusBadge = (status: AdminSupportTicketDto['status']) => {
  switch (status) {
    case 'open':
      return <span className="badge bg-success-subtle text-success">Açık</span>;
    case 'in_progress':
      return <span className="badge bg-info-subtle text-info">İşlemde</span>;
    case 'waiting_response':
      return <span className="badge bg-warning-subtle text-warning">Yanıt Bekleniyor</span>;
    case 'closed':
      return <span className="badge bg-secondary-subtle text-muted">Kapalı</span>;
    default:
      return <span className="badge bg-light text-muted">{safeText(status) || '-'}</span>;
  }
};

const priorityBadge = (priority: AdminSupportTicketDto['priority']) => {
  switch (priority) {
    case 'low':
      return <span className="badge bg-secondary-subtle text-muted">Düşük</span>;
    case 'medium':
      return <span className="badge bg-primary-subtle text-primary">Orta</span>;
    case 'high':
      return <span className="badge bg-warning-subtle text-warning">Yüksek</span>;
    case 'urgent':
      return <span className="badge bg-danger-subtle text-danger">Acil</span>;
    default:
      return <span className="badge bg-light text-muted">{safeText(priority) || '-'}</span>;
  }
};

const getUserDisplay = (t: AdminSupportTicketDto) =>
  safeText((t as any).user_display_name).trim() ||
  safeText((t as any).user_email).trim() ||
  safeText((t as any).user_id).trim() ||
  '-';

/* ---------------- Component ---------------- */

export type SupportListProps = {
  items: AdminSupportTicketDto[];
  loading: boolean;
};

export const SupportList: React.FC<SupportListProps> = ({ items, loading }) => {
  const router = useRouter();

  const rows = items ?? [];
  const hasData = rows.length > 0;
  const busy = !!loading;

  const goDetail = (t: AdminSupportTicketDto) => {
    router.push(`/admin/support/${encodeURIComponent(String((t as any).id))}`);
  };

  if (!busy && !hasData) {
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
      {/* ===================== XXL+ TABLE ===================== */}
      <div className="d-none d-xxl-block">
        <div className="table-responsive">
          <table
            className="table table-sm align-middle mb-0"
            style={{ tableLayout: 'fixed', width: '100%' }}
          >
            <colgroup>
              <col style={{ width: '56px' }} /> {/* # */}
              <col style={{ width: '520px' }} /> {/* subject */}
              <col style={{ width: '260px' }} /> {/* user */}
              <col style={{ width: '150px' }} /> {/* status */}
              <col style={{ width: '150px' }} /> {/* priority */}
              <col style={{ width: '180px' }} /> {/* created */}
              <col style={{ width: '180px' }} /> {/* updated */}
            </colgroup>

            <thead className="table-light">
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>#</th>
                <th style={{ whiteSpace: 'nowrap' }}>Konu</th>
                <th style={{ whiteSpace: 'nowrap' }}>Kullanıcı</th>
                <th style={{ whiteSpace: 'nowrap' }}>Durum</th>
                <th style={{ whiteSpace: 'nowrap' }}>Öncelik</th>
                <th style={{ whiteSpace: 'nowrap' }}>Oluşturulma</th>
                <th style={{ whiteSpace: 'nowrap' }}>Son Güncelleme</th>
              </tr>
            </thead>

            <tbody>
              {busy ? (
                <tr>
                  <td colSpan={7} className="text-center py-3 text-muted small">
                    Yükleniyor...
                  </td>
                </tr>
              ) : (
                rows.map((t, idx) => {
                  const id = String((t as any).id);
                  const subject = safeText((t as any).subject);
                  const userDisplay = getUserDisplay(t);

                  return (
                    <tr key={id} onClick={() => goDetail(t)} style={{ cursor: 'pointer' }}>
                      <td className="text-muted small text-nowrap">{idx + 1}</td>

                      <td style={{ minWidth: 0 }}>
                        <div className="fw-semibold text-truncate" title={subject || '-'}>
                          {formatText(subject, 120)}
                        </div>
                      </td>

                      <td className="text-muted small" style={{ minWidth: 0 }}>
                        <div className="text-truncate" title={userDisplay}>
                          {userDisplay}
                        </div>
                      </td>

                      <td className="text-nowrap">{statusBadge((t as any).status)}</td>
                      <td className="text-nowrap">{priorityBadge((t as any).priority)}</td>

                      <td className="text-muted small text-nowrap">
                        {fmtDate((t as any).created_at)}
                      </td>
                      <td className="text-muted small text-nowrap">
                        {fmtDate((t as any).updated_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== < XXL : CARDS ===================== */}
      <div className="d-block d-xxl-none">
        {busy ? (
          <div className="card-body py-3 text-center text-muted small">Yükleniyor...</div>
        ) : (
          <div className="p-3">
            <div className="row g-3">
              {rows.map((t, idx) => {
                const id = String((t as any).id);
                const subject = safeText((t as any).subject);
                const userDisplay = getUserDisplay(t);

                return (
                  <div key={id} className="col-12 col-lg-6">
                    <div
                      className="border rounded-3 p-3 bg-white h-100"
                      role="button"
                      tabIndex={0}
                      onClick={() => goDetail(t)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') goDetail(t);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        <div className="d-flex flex-wrap gap-2">
                          <span className="badge bg-light text-dark border">#{idx + 1}</span>
                          {statusBadge((t as any).status)}
                          {priorityBadge((t as any).priority)}
                        </div>
                      </div>

                      <div className="mt-2">
                        <div className="fw-semibold" style={{ wordBreak: 'break-word' }}>
                          {formatText(subject, 140)}
                        </div>
                        <div className="text-muted small mt-1" style={{ wordBreak: 'break-word' }}>
                          Kullanıcı: {userDisplay}
                        </div>
                      </div>

                      <div className="mt-2 text-muted small">
                        <div>Oluşturulma: {fmtDate((t as any).created_at)}</div>
                        <div>Güncelleme: {fmtDate((t as any).updated_at)}</div>
                      </div>

                      <div className="mt-3 d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            goDetail(t);
                          }}
                        >
                          Detay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3">
              <span className="text-muted small">
                Kartlara tıklayarak detaya gidebilirsin. Tablo görünümü xxl+ ekranda açılır.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
