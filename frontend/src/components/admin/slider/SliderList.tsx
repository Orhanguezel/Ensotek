// =============================================================
// FILE: src/components/admin/slider/SliderList.tsx
// Ensotek – Slider Listesi (Bootstrap table + drag & drop)
// =============================================================

import React, { useState } from 'react';
import type { SliderAdminDto } from '@/integrations/types/slider.types';

const formatText = (v: unknown, max = 80): string => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + '...';
};

export type SliderListProps = {
  items: SliderAdminDto[];
  loading: boolean;

  onEdit: (item: SliderAdminDto) => void;
  onDelete: (item: SliderAdminDto) => void;

  onToggleActive: (item: SliderAdminDto, value: boolean) => void;
  onToggleFeatured: (item: SliderAdminDto, value: boolean) => void;

  onReorder: (next: SliderAdminDto[]) => void;
  onSaveOrder: () => void;
  savingOrder: boolean;
};

export const SliderList: React.FC<SliderListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleFeatured,
  onReorder,
  onSaveOrder,
  savingOrder,
}) => {
  const [dragId, setDragId] = useState<string | null>(null);
  const hasData = !!items?.length;

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;

    const currentIndex = items.findIndex((i) => String(i.id) === dragId);
    const targetIndex = items.findIndex((i) => String(i.id) === targetId);
    if (currentIndex === -1 || targetIndex === -1) return;

    const next = [...items];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);

    onReorder(next);
    setDragId(null);
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center py-2">
        <div className="small fw-semibold">Slider Listesi</div>
        <div className="d-flex align-items-center gap-2">
          {loading && (
            <span className="small text-muted d-flex align-items-center gap-1">
              <span className="spinner-border spinner-border-sm" role="status" />
              <span>Yükleniyor...</span>
            </span>
          )}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={onSaveOrder}
            disabled={!hasData || savingOrder}
          >
            {savingOrder ? 'Sıralama kaydediliyor...' : 'Sıralamayı Kaydet'}
          </button>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th style={{ width: 90 }}>Görsel</th>
                <th>Başlık</th>
                <th>Dil</th>
                <th>Slug</th>
                <th className="text-center">Aktif</th>
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
                  <td colSpan={9} className="text-center py-4 small text-muted">
                    {loading ? 'Slider kayıtları yükleniyor...' : 'Henüz slider kaydı bulunmuyor.'}
                  </td>
                </tr>
              )}

              {items.map((item, index) => {
                const id = String(item.id);
                const img = item.image_effective_url || item.image_url || '';

                return (
                  <tr
                    key={id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, id)}
                    style={{
                      cursor: 'move',
                      opacity: dragId && dragId === id ? 0.6 : 1,
                    }}
                  >
                    <td className="text-muted small align-middle">
                      <span className="me-1">≡</span>
                      {index + 1}
                    </td>

                    <td className="align-middle">
                      {img ? (
                        <div
                          className="border rounded bg-light"
                          style={{ width: 80, height: 48, overflow: 'hidden' }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={item.alt || item.name || 'slider'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <span className="badge bg-light text-muted small">Görsel yok</span>
                      )}
                    </td>

                    <td className="align-middle">
                      <div className="fw-semibold small">
                        {item.name}
                        {item.buttonText && (
                          <span className="text-muted ms-1">
                            <small>({item.buttonText})</small>
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <div className="text-muted small">{formatText(item.description, 80)}</div>
                      )}
                      {item.buttonLink && (
                        <div className="text-muted small mt-1">
                          <span className="me-1">Link:</span>
                          <code>{formatText(item.buttonLink, 60)}</code>
                        </div>
                      )}
                    </td>

                    <td className="align-middle small">{(item.locale || 'tr').toLowerCase()}</td>

                    <td className="align-middle small">
                      <code>{item.slug}</code>
                    </td>

                    <td className="align-middle text-center">
                      <div className="form-check form-switch d-inline-flex">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!item.is_active}
                          onChange={(e) => onToggleActive(item, e.target.checked)}
                        />
                      </div>
                    </td>

                    <td className="align-middle text-center">
                      <div className="form-check form-switch d-inline-flex">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!item.featured}
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
                Satırları sürükleyip bırakarak slider sırasını değiştirebilirsin. Değişiklikleri
                kalıcı yapmak için <strong>&quot;Sıralamayı Kaydet&quot;</strong> butonuna bas.
              </span>
            </caption>
          </table>
        </div>
      </div>
    </div>
  );
};
