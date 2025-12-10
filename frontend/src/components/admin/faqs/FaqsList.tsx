// =============================================================
// FILE: src/components/admin/faqs/FaqsList.tsx
// Admin FAQ Listesi (tablo) – Kategorisiz sade liste
// =============================================================

import React from "react";
import type { FaqDto } from "@/integrations/types/faqs.types";

interface FaqsListProps {
  items: FaqDto[];
  loading: boolean;
  onEdit: (item: FaqDto) => void;
  onDelete: (item: FaqDto) => void;
  onToggleActive: (item: FaqDto, value: boolean) => void;
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

export const FaqsList: React.FC<FaqsListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const rows = items ?? [];

  return (
    <div className="card">
      <div className="card-body p-2">
        <div className="table-responsive">
          <table className="table table-hover table-sm align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "5%" }}>Sıra</th>
                <th style={{ width: "35%" }}>Soru</th>
                <th style={{ width: "25%" }}>Slug</th>
                <th style={{ width: "10%" }}>Aktif</th>
                <th style={{ width: "15%" }}>Tarih</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Yükleniyor...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                rows.map((item, idx) => {
                  const isActive = item.is_active === 1;

                  const created =
                    typeof item.created_at === "string"
                      ? item.created_at
                      : item.created_at?.toString?.() ?? "";

                  const updated =
                    typeof item.updated_at === "string"
                      ? item.updated_at
                      : item.updated_at?.toString?.() ?? "";

                  return (
                    <tr key={item.id}>
                      {/* sıra */}
                      <td className="text-muted small align-middle">
                        <span className="me-1">#</span>
                        <span>{item.display_order ?? idx + 1}</span>
                      </td>

                      {/* soru + locale */}
                      <td className="small">
                        <div className="fw-semibold text-truncate">
                          {item.question || (
                            <span className="text-muted">
                              (soru yok)
                            </span>
                          )}
                        </div>
                        {item.locale_resolved && (
                          <div className="text-muted small">
                            locale:{" "}
                            <code>{item.locale_resolved}</code>
                          </div>
                        )}
                      </td>

                      {/* slug */}
                      <td className="small">
                        <div
                          className="text-truncate"
                          style={{ maxWidth: 260 }}
                        >
                          <code>{item.slug ?? "-"}</code>
                        </div>
                      </td>

                      {/* aktif toggle */}
                      <td>
                        <div className="form-check form-switch d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) =>
                              onToggleActive(item, e.target.checked)
                            }
                          />
                        </div>
                      </td>

                      {/* tarihler */}
                      <td className="small">
                        <div>{formatDate(created)}</div>
                        <div className="text-muted small">
                          Güncelleme: {formatDate(updated)}
                        </div>
                      </td>

                      {/* işlemler */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onEdit(item)}
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onDelete(item)}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
