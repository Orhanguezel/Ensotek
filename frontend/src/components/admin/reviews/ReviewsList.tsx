// =============================================================
// FILE: src/components/admin/reviews/ReviewsList.tsx
// Ensotek – Admin Reviews Table
// =============================================================

import React from "react";
import { useRouter } from "next/router";
import type { AdminReviewDto } from "@/integrations/types/review_admin.types";

export type ReviewsListProps = {
  items: AdminReviewDto[];
  loading: boolean;
  onDelete: (item: AdminReviewDto) => void;
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

export const ReviewsList: React.FC<ReviewsListProps> = ({
  items,
  loading,
  onDelete,
}) => {
  const router = useRouter();

  const handleRowClick = (item: AdminReviewDto) => {
    router.push(`/admin/reviews/${encodeURIComponent(item.id)}`);
  };

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: AdminReviewDto,
  ) => {
    e.stopPropagation();
    if (!loading) {
      onDelete(item);
    }
  };

  if (!loading && items.length === 0) {
    return (
      <div className="card">
        <div className="card-body py-4 text-center text-muted small">
          Henüz kayıtlı bir yorum yok.
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
              <th style={{ width: "24px" }} />
              <th>İsim</th>
              <th>E-posta</th>
              <th>Puan</th>
              <th>Onay</th>
              <th>Aktif</th>
              <th>Locale</th>
              <th>Yorum</th>
              <th>Oluşturulma</th>
              <th style={{ width: "90px" }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr
                key={r.id}
                onClick={() => handleRowClick(r)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className="badge bg-secondary-subtle text-muted border">
                    {r.display_order}
                  </span>
                </td>
                <td className="fw-semibold">{r.name}</td>
                <td className="text-muted small">{r.email}</td>
                <td>
                  <span className="badge bg-primary-subtle text-primary">
                    {r.rating.toFixed?.(1) ?? r.rating}
                  </span>
                </td>
                <td>
                  {r.is_approved ? (
                    <span className="badge bg-success-subtle text-success">
                      Onaylı
                    </span>
                  ) : (
                    <span className="badge bg-warning-subtle text-warning">
                      Bekliyor
                    </span>
                  )}
                </td>
                <td>
                  {r.is_active ? (
                    <span className="badge bg-success-subtle text-success">
                      Aktif
                    </span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-muted">
                      Pasif
                    </span>
                  )}
                </td>
                <td className="text-muted small">
                  {r.locale_resolved ?? "-"}
                </td>
                <td className="text-muted small">
                  {r.comment
                    ? r.comment.length > 60
                      ? `${r.comment.slice(0, 60)}…`
                      : r.comment
                    : "-"}
                </td>
                <td className="text-muted small">
                  {fmtDate(r.created_at)}
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(r);
                      }}
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={(e) => handleDeleteClick(e, r)}
                      disabled={loading}
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={10} className="text-center py-3 text-muted small">
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
