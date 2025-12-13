// =============================================================
// FILE: src/components/admin/offer/OfferList.tsx
// Ensotek – Offer Listesi (Bootstrap table, ReferencesList pattern’i)
// =============================================================

"use client";

import React from "react";
import type { OfferRow } from "@/integrations/types/offers.types";

// Kısa metin özet helper
const formatText = (v: unknown, max = 80): string => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + "...";
};

export type OfferListProps = {
  items: OfferRow[];
  loading: boolean;
  onEdit: (item: OfferRow) => void;
  onDelete: (item: OfferRow) => void;
};

export const OfferList: React.FC<OfferListProps> = ({
  items,
  loading,
  onEdit,
  onDelete,
}) => {
  const hasData = items && items.length > 0;

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center py-2">
        <div className="small fw-semibold">Teklifler</div>
        {loading && (
          <span className="small text-muted d-flex align-items-center gap-1">
            <span className="spinner-border spinner-border-sm" role="status" />
            <span>Yükleniyor...</span>
          </span>
        )}
      </div>

      {/* Table */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th style={{ width: 120 }}>Oluşturulma</th>
                <th style={{ width: 110 }}>Durum</th>
                <th>Müşteri / Firma</th>
                <th>E-posta</th>
                <th>Konu</th>
                <th className="text-end" style={{ width: 130 }}>
                  Toplam (Brüt)
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
                      ? "Teklif kayıtları yükleniyor..."
                      : "Henüz teklif kaydı bulunmuyor."}
                  </td>
                </tr>
              )}

              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-muted small align-middle">
                    {index + 1}
                  </td>

                  <td className="align-middle small text-muted">
                    {item.created_at}
                  </td>

                  <td className="align-middle">
                    <span className="badge bg-light text-dark small">
                      {item.status}
                    </span>
                  </td>

                  <td className="align-middle">
                    <div className="fw-semibold small">
                      {item.customer_name}
                    </div>
                    <div className="text-muted small">
                      {item.company_name || ""}
                    </div>
                  </td>

                  <td className="align-middle small">{item.email}</td>

                  <td className="align-middle small">
                    {formatText(item.subject ?? "", 60)}
                  </td>

                  <td className="align-middle text-end small">
                    {item.gross_total != null ? (
                      <>
                        <span className="fw-semibold">{item.gross_total}</span>{" "}
                        <span className="text-muted">
                          {item.currency || "EUR"}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>

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
              ))}
            </tbody>

            <caption className="px-3 py-2 text-start">
              <span className="text-muted small">
                Teklifler arama, durum filtresi ve diğer parametrelere göre
                yönetilebilir. Detay, PDF üretimi ve e-posta gönderimi için
                <strong> “Düzenle”</strong> butonunu kullanın.
              </span>
            </caption>
          </table>
        </div>
      </div>
    </div>
  );
};
