// =============================================================
// FILE: src/components/admin/library/LibraryList.tsx
// Ensotek – Library Listesi (Bootstrap table)
// Backend LibraryDto + RTK tipleri ile tam uyumlu
// =============================================================

import React from "react";
import type { LibraryDto } from "@/integrations/types/library.types";

// Kısa özet helper
const formatText = (v: unknown, max = 80): string => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
};

export type LibraryListProps = {
  items: LibraryDto[];
  loading: boolean;

  onEdit: (item: LibraryDto) => void;
  onDelete: (item: LibraryDto) => void;

  // Published toggle
  onTogglePublished: (item: LibraryDto, value: boolean) => void;
  // UI: "Öne Çıkan" switch'i is_active ile eşlenmiş durumda
  onToggleFeatured: (item: LibraryDto, value: boolean) => void;
};

export const LibraryList: React.FC<LibraryListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}) => {
  const hasData = items && items.length > 0;

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center py-2">
        <div className="small fw-semibold">Library İçerikleri</div>
        {loading && (
          <span className="small text-muted d-flex align-items-center gap-1">
            <span
              className="spinner-border spinner-border-sm"
              role="status"
            />
            <span>Yükleniyor...</span>
          </span>
        )}
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Başlık / Slug</th>
                <th>Özet</th>
                <th className="text-center">Yayın</th>
                <th className="text-center">Aktif</th>
                <th className="text-center">Görüntülenme</th>
                <th className="text-center">İndirme</th>
                <th className="text-center" style={{ width: 80 }}>
                  Sıra
                </th>
                <th style={{ width: 140 }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {!hasData && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-4 small text-muted"
                  >
                    {loading
                      ? "Library içerikleri yükleniyor..."
                      : "Henüz kayıtlı library içeriği bulunmuyor."}
                  </td>
                </tr>
              )}

              {items.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="text-muted small align-middle">
                      {index + 1}
                    </td>

                    {/* Başlık / Slug */}
                    <td className="align-middle">
                      <div className="fw-semibold small">
                        {item.title || "(Başlık yok)"}
                      </div>
                      <div className="text-muted small">
                        <code>{item.slug || "(slug yok)"}</code>
                      </div>
                    </td>

                    {/* Özet */}
                    <td className="align-middle small">
                      {item.summary ? (
                        <span>{formatText(item.summary, 120)}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    {/* Yayın durumu */}
                    <td className="align-middle text-center">
                      <div className="form-check form-switch d-inline-flex">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={item.is_published === 1}
                          onChange={(e) =>
                            onTogglePublished(item, e.target.checked)
                          }
                        />
                      </div>
                    </td>

                    {/* Aktif (UI'de eskiden "Öne Çıkan") */}
                    <td className="align-middle text-center">
                      <div className="form-check form-switch d-inline-flex">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={item.is_active === 1}
                          onChange={(e) =>
                            onToggleFeatured(item, e.target.checked)
                          }
                        />
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="align-middle text-center small">
                      {item.views ?? 0}
                    </td>
                    <td className="align-middle text-center small">
                      {item.download_count ?? 0}
                    </td>

                    {/* Display order */}
                    <td className="align-middle text-center small">
                      {item.display_order ?? 0}
                    </td>

                    {/* Actions */}
                    <td className="align-middle text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
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
            <caption className="px-3 py-2 text-start">
              <span className="text-muted small">
                Library içerik listesi yayın ve aktiflik durumuna göre
                filtrelenebilir. Detay içerik için &quot;Düzenle&quot;
                butonunu kullan.
              </span>
            </caption>
          </table>
        </div>
      </div>
    </div>
  );
};
