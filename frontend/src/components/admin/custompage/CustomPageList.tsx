// =============================================================
// FILE: src/components/admin/custompage/CustomPageList.tsx
// Ensotek – Admin Custom Pages Listesi + Drag & Drop Reorder
// =============================================================

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";
import { useDeleteCustomPageAdminMutation } from "@/integrations/rtk/hooks";

export type CustomPageListProps = {
  items?: CustomPageDto[];
  loading: boolean;

  // Drag & drop sıralama
  onReorder?: (next: CustomPageDto[]) => void;
  onSaveOrder?: () => void;
  savingOrder?: boolean;
};

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

export const CustomPageList: React.FC<CustomPageListProps> = ({
  items,
  loading,
  onReorder,
  onSaveOrder,
  savingOrder,
}) => {
  const rows = items ?? [];
  const hasData = rows.length > 0;

  const [deletePage, { isLoading: isDeleting }] =
    useDeleteCustomPageAdminMutation();

  const busy = loading || isDeleting || !!savingOrder;

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDelete = async (page: CustomPageDto) => {
    const ok = window.confirm(
      `Bu sayfayı silmek üzeresin.\n\n` +
        `Başlık: ${page.title ?? "(başlık yok)"}\n` +
        `Slug: ${page.slug ?? "(slug yok)"}\n\n` +
        `Devam etmek istiyor musun?`,
    );
    if (!ok) return;

    try {
      // ❗ Argüman sadece string id olmalı
      await deletePage(page.id).unwrap();
      toast.success("Sayfa başarıyla silindi.");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: { message?: string } } })?.data
          ?.error?.message ?? "Sayfa silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDropOn = (targetId: string) => {
    if (!draggingId || draggingId === targetId || !onReorder) return;

    const currentIndex = rows.findIndex((r) => r.id === draggingId);
    const targetIndex = rows.findIndex((r) => r.id === targetId);
    if (currentIndex === -1 || targetIndex === -1) return;

    const next = [...rows];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);

    onReorder(next);
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Sayfa Listesi</span>
        <div className="d-flex align-items-center gap-2">
          {loading && (
            <span className="badge bg-secondary small">
              Yükleniyor...
            </span>
          )}
          {onSaveOrder && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={onSaveOrder}
              disabled={savingOrder || !hasData}
            >
              {savingOrder
                ? "Sıralama kaydediliyor..."
                : "Sıralamayı Kaydet"}
            </button>
          )}
          <span className="text-muted small">
            Toplam: <strong>{rows.length}</strong>
          </span>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table-sm mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "4%" }} />
                <th style={{ width: "26%" }}>Başlık</th>
                <th style={{ width: "20%" }}>Slug</th>
                <th style={{ width: "15%" }}>Kategori</th>
                <th style={{ width: "10%" }}>Durum</th>
                <th style={{ width: "15%" }}>Oluşturulma</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="text-center text-muted small py-3">
                      Sayfalar yükleniyor...
                    </div>
                  </td>
                </tr>
              ) : hasData ? (
                rows.map((p, idx) => {
                  // Detay sayfası slug bazlı /admin/custompage/[slug]
                  // slug yoksa id fallback (her dil için aynı page_id)
                  const editSlug = p.slug || p.id;
                  return (
                    <tr
                      key={p.id}
                      draggable
                      onDragStart={() => handleDragStart(p.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDropOn(p.id)}
                      className={
                        draggingId === p.id ? "table-active" : undefined
                      }
                      style={{ cursor: "move" }}
                    >
                      <td className="text-muted small align-middle">
                        <span className="me-1">≡</span>
                        <span>{idx + 1}</span>
                      </td>

                      {/* Başlık + SEO Title */}
                      <td className="small">
                        <div className="fw-semibold text-truncate">
                          {p.title ?? (
                            <span className="text-muted">
                              Başlık yok
                            </span>
                          )}
                        </div>
                        {p.meta_title && (
                          <div
                            className="text-muted small text-truncate"
                            style={{ maxWidth: 260 }}
                          >
                            SEO Title: {p.meta_title}
                          </div>
                        )}
                      </td>

                      {/* Slug + Locale */}
                      <td className="small">
                        <div
                          className="text-truncate"
                          style={{ maxWidth: 260 }}
                        >
                          <code>{p.slug ?? "-"}</code>
                        </div>
                        {p.locale_resolved && (
                          <div className="text-muted small">
                            Locale: <code>{p.locale_resolved}</code>
                          </div>
                        )}
                      </td>

                      {/* Kategori / Alt kategori */}
                      <td className="small">
                        {/* Ana kategori */}
                        {p.category_name || p.category_slug ? (
                          <>
                            <div className="fw-semibold text-truncate">
                              {p.category_name ?? "(Kategori adı yok)"}
                            </div>
                            {p.category_slug && (
                              <div
                                className="text-muted small text-truncate"
                                style={{ maxWidth: 260 }}
                              >
                                <span>Slug: </span>
                                <code>{p.category_slug}</code>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-muted small">
                            Kategori atanmadı
                          </div>
                        )}

                        {/* Alt kategori */}
                        {p.sub_category_name || p.sub_category_slug ? (
                          <div className="mt-1">
                            <div className="text-truncate">
                              <span className="small">
                                Alt Kategori:{" "}
                              </span>
                              <span className="fw-semibold">
                                {p.sub_category_name ??
                                  "(Alt kategori adı yok)"}
                              </span>
                            </div>
                            {p.sub_category_slug && (
                              <div
                                className="text-muted small text-truncate"
                                style={{ maxWidth: 260 }}
                              >
                                <span>Slug: </span>
                                <code>{p.sub_category_slug}</code>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </td>

                      {/* Durum */}
                      <td className="small">
                        {p.is_published ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            Yayında
                          </span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                            Taslak
                          </span>
                        )}
                      </td>

                      {/* Tarihler */}
                      <td className="small">
                        <div>{formatDate(p.created_at)}</div>
                        <div className="text-muted small">
                          Güncelleme: {formatDate(p.updated_at)}
                        </div>
                      </td>

                      {/* İşlemler */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <Link
                            href={`/admin/custompage/${encodeURIComponent(
                              editSlug,
                            )}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Düzenle
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            disabled={busy}
                            onClick={() => handleDelete(p)}
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="text-center text-muted small py-3">
                      Henüz kayıtlı sayfa bulunmuyor.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <caption className="px-3 py-2 text-start">
              <span className="text-muted small">
                Satırları sürükleyip bırakarak özel sayfaların
                sıralamasını değiştirebilirsin. Değişiklikleri kalıcı
                yapmak için{" "}
                <strong>&quot;Sıralamayı Kaydet&quot;</strong> butonunu
                kullan.
              </span>
            </caption>
          </table>
        </div>
      </div>
    </div>
  );
};
