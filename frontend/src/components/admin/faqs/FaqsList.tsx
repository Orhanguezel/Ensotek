// =============================================================
// FILE: src/components/admin/faqs/FaqsList.tsx
// Admin FAQ Listesi (tablo)
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

export const FaqsList: React.FC<FaqsListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className="card">
      <div className="card-body p-2">
        <div className="table-responsive">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Sıra</th>
                <th>Soru</th>
                <th>Slug</th>
                <th>Kategori</th>
                <th style={{ width: "80px" }}>Aktif</th>
                <th style={{ width: "180px" }}>Tarih</th>
                <th style={{ width: "130px" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Yükleniyor...
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}

              {!loading &&
                items.map((item) => {
                  // FaqDto.is_active: 0 | 1
                  const isActive = item.is_active === 1;

                  const created =
                    typeof item.created_at === "string"
                      ? item.created_at
                      : item.created_at?.toISOString?.() ?? "";
                  const updated =
                    typeof item.updated_at === "string"
                      ? item.updated_at
                      : item.updated_at?.toISOString?.() ?? "";

                  return (
                    <tr key={item.id}>
                      <td>
                        <span className="badge bg-light text-muted">
                          {item.display_order ?? 0}
                        </span>
                      </td>
                      <td>
                        <div className="fw-semibold small">
                          {item.question || (
                            <span className="text-muted">
                              (soru yok)
                            </span>
                          )}
                        </div>
                        {item.locale_resolved && (
                          <div className="text-muted small">
                            locale: {item.locale_resolved}
                          </div>
                        )}
                      </td>
                      <td className="small">
                        {item.slug || (
                          <span className="text-muted">(yok)</span>
                        )}
                      </td>
                      <td className="small">
                        {item.category || (
                          <span className="text-muted">(yok)</span>
                        )}
                      </td>
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
                      <td className="small">
                        <div>Oluşturma: {created}</div>
                        <div>Güncelleme: {updated}</div>
                      </td>
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
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
