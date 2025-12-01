// =============================================================
// FILE: src/components/admin/products/ProductsList.tsx
// Ensotek – Admin Products Listesi
// =============================================================

import React from "react";
import Link from "next/link";
import type { ProductDto } from "@/integrations/types/product.types";

export type ProductsListProps = {
  items?: ProductDto[];
  loading: boolean;
  onDelete?: (item: ProductDto) => void;
};

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

const formatPrice = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "-";
  return `${value.toFixed(2)} ₺`;
};

export const ProductsList: React.FC<ProductsListProps> = ({
  items,
  loading,
  onDelete,
}) => {
  const rows = items ?? [];
  const hasData = rows.length > 0;

  const busy = loading;

  const handleDelete = (p: ProductDto) => {
    if (!onDelete) return;
    const ok = window.confirm(
      `Bu ürünü silmek üzeresin.\n\n` +
        `Başlık: ${p.title}\n` +
        `Slug: ${p.slug}\n\n` +
        `Devam etmek istiyor musun?`,
    );
    if (!ok) return;
    onDelete(p);
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">Ürün Listesi</span>
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
                <th style={{ width: "24%" }}>Başlık</th>
                <th style={{ width: "14%" }}>Slug</th>
                <th style={{ width: "10%" }}>Fiyat</th>
                <th style={{ width: "8%" }}>Stok</th>
                <th style={{ width: "6%" }}>Dil</th>
                <th style={{ width: "10%" }}>Durum</th>
                <th style={{ width: "14%" }}>Tarih</th>
                <th style={{ width: "10%" }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9}>
                    <div className="text-center text-muted small py-3">
                      Ürünler yükleniyor...
                    </div>
                  </td>
                </tr>
              ) : hasData ? (
                rows.map((p, idx) => (
                  <tr key={p.id}>
                    <td className="text-muted small">{idx + 1}</td>
                    <td className="small">
                      <div className="fw-semibold text-truncate">
                        {p.title}
                      </div>
                      {p.product_code && (
                        <div className="text-muted small">
                          Kod: <code>{p.product_code}</code>
                        </div>
                      )}
                    </td>
                    <td className="small">
                      <div
                        className="text-truncate"
                        style={{ maxWidth: 200 }}
                      >
                        <code>{p.slug}</code>
                      </div>
                    </td>
                    <td className="small">{formatPrice(p.price)}</td>
                    <td className="small">{p.stock_quantity}</td>
                    <td className="small">
                      <code>{p.locale}</code>
                    </td>
                    <td className="small">
                      <div className="d-flex flex-column gap-1">
                        {p.is_active ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle">
                            Aktif
                          </span>
                        ) : (
                          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                            Pasif
                          </span>
                        )}
                        {p.is_featured && (
                          <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                            Öne çıkan
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="small">
                      <div>{formatDate(p.created_at)}</div>
                      <div className="text-muted small">
                        Güncelleme: {formatDate(p.updated_at)}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Link
                          href={`/admin/products/${encodeURIComponent(p.id)}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Düzenle
                        </Link>
                        {onDelete && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            disabled={busy}
                            onClick={() => handleDelete(p)}
                          >
                            Sil
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="text-center text-muted small py-3">
                      Henüz kayıtlı ürün bulunmuyor.
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
