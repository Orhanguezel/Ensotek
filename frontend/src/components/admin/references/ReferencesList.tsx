// =============================================================
// FILE: src/components/admin/references/ReferencesList.tsx
// Ensotek – References Listesi (Bootstrap table)
// =============================================================

import React from 'react';
import type { ReferenceDto } from '@/integrations/types/references.types';
import Image from 'next/image';

// Kısa özet helper
const formatText = (v: unknown, max = 80): string => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + '...';
};

// BoolLike -> boolean
const isTruthyBoolLike = (v: any) => v === true || v === 1 || v === '1' || v === 'true';

export type ReferencesListProps = {
  items: ReferenceDto[];
  loading: boolean;

  onEdit: (item: ReferenceDto) => void;
  onDelete: (item: ReferenceDto) => void;

  onTogglePublished: (item: ReferenceDto, value: boolean) => void;
  onToggleFeatured: (item: ReferenceDto, value: boolean) => void;
};

export const ReferencesList: React.FC<ReferencesListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onTogglePublished,
  onToggleFeatured,
}) => {
  const hasData = !!items?.length;

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center py-2">
        <div className="small fw-semibold">Referanslar</div>
        {loading && (
          <span className="small text-muted d-flex align-items-center gap-1">
            <span className="spinner-border spinner-border-sm" role="status" />
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
                <th style={{ width: 90 }}>Görsel</th>
                <th>Başlık / Slug</th>
                <th>Website</th>
                <th className="text-center">Yayın</th>
                <th className="text-center">Öne Çıkan</th>
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
                  <td colSpan={8} className="text-center py-4 small text-muted">
                    {loading
                      ? 'Referans kayıtları yükleniyor...'
                      : 'Henüz referans kaydı bulunmuyor.'}
                  </td>
                </tr>
              )}

              {items.map((item, index) => {
                const img = item.featured_image_url_resolved || item.featured_image || undefined;

                const isPublished = isTruthyBoolLike(item.is_published);
                const isFeatured = isTruthyBoolLike(item.is_featured);

                return (
                  <tr key={String(item.id)}>
                    <td className="text-muted small align-middle">{index + 1}</td>

                    <td className="align-middle">
                      {img ? (
                        <Image
                          src={img}
                          alt={item.featured_image_alt || item.title || ''}
                          className="img-thumbnail"
                          width={80}
                          height={48}
                          style={{ maxWidth: 80, maxHeight: 48, objectFit: 'cover' }}
                        />
                      ) : (
                        <span className="badge bg-light text-muted small">Görsel yok</span>
                      )}
                    </td>

                    <td className="align-middle">
                      <div className="fw-semibold small">{item.title || '(Başlık yok)'}</div>
                      <div className="text-muted small">
                        <code>{item.slug || '(slug yok)'}</code>
                      </div>
                      {item.summary && (
                        <div className="text-muted small mt-1">{formatText(item.summary, 90)}</div>
                      )}
                    </td>

                    <td className="align-middle small">
                      {item.website_url ? (
                        <a href={item.website_url} target="_blank" rel="noreferrer">
                          {formatText(item.website_url, 40)}
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    <td className="align-middle text-center">
                      <div className="form-check form-switch d-inline-flex">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isPublished}
                          onChange={(e) => onTogglePublished(item, e.target.checked)}
                        />
                      </div>
                    </td>

                    <td className="align-middle text-center">
                      <div className="form-check form-switch d-inline-flex">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => onToggleFeatured(item, e.target.checked)}
                        />
                      </div>
                    </td>

                    <td className="align-middle text-center small">{item.display_order ?? 0}</td>

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
                Referans listesi yayın durumu ve öne çıkarma bayraklarına göre filtrelenebilir.
                Detay içerik için &quot;Düzenle&quot; butonunu kullan.
              </span>
            </caption>
          </table>
        </div>
      </div>
    </div>
  );
};
