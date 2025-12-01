// =============================================================
// FILE: src/components/admin/custompage/CustomPageList.tsx
// Ensotek – Admin Custom Pages Listesi
// =============================================================

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { CustomPageDto } from "@/integrations/types/custom_pages.types";
import { useDeleteCustomPageAdminMutation } from "@/integrations/rtk/endpoints/admin/custom_pages_admin.endpoints";

export type CustomPageListProps = {
  items?: CustomPageDto[];
  loading: boolean;
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
}) => {
  const rows = items ?? [];
  const hasData = rows.length > 0;

  const [deletePage, { isLoading: isDeleting }] =
    useDeleteCustomPageAdminMutation();

  const busy = loading || isDeleting;

  const handleDelete = async (page: CustomPageDto) => {
    const ok = window.confirm(
      `Bu sayfayı silmek üzeresin.\n\n` +
        `Başlık: ${page.title ?? "(başlık yok)"}\n` +
        `Slug: ${page.slug ?? "(slug yok)"}\n\n` +
        `Devam etmek istiyor musun?`,
    );
    if (!ok) return;

    try {
      await deletePage({ id: page.id }).unwrap();
      toast.success("Sayfa başarıyla silindi.");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: { message?: string } } })?.data
          ?.error?.message ?? "Sayfa silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Sayfa Listesi</span>
        <div className="d-flex align-items-center gap-2">
          {busy && (
            <span className="badge bg-secondary small">
              İşlem yapılıyor...
            </span>
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
                <th style={{ width: "4%" }}>#</th>
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
                  const editSlug = p.slug || p.id; // slug yoksa id fallback
                  return (
                    <tr key={p.id}>
                      <td className="text-muted small">{idx + 1}</td>
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
                      <td className="small">
                        <div
                          className="text-truncate"
                          style={{ maxWidth: 260 }}
                        >
                          <code>{p.slug ?? "-"}</code>
                        </div>
                        {p.locale_resolved && (
                          <div className="text-muted small">
                            Locale:{" "}
                            <code>{p.locale_resolved}</code>
                          </div>
                        )}
                      </td>
                      <td className="small">
                        <div className="text-muted small">
                          Category ID:{" "}
                          <code>{p.category_id ?? "—"}</code>
                        </div>
                        <div className="text-muted small">
                          SubCat ID:{" "}
                          <code>{p.sub_category_id ?? "—"}</code>
                        </div>
                      </td>
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
                      <td className="small">
                        <div>{formatDate(p.created_at)}</div>
                        <div className="text-muted small">
                          Güncelleme:{" "}
                          {formatDate(p.updated_at)}
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {/* Detay sayfası slug bazlı: /admin/custompage/[slug] */}
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
          </table>
        </div>
      </div>
    </div>
  );
};
