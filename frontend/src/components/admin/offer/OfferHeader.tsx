// =============================================================
// FILE: src/components/admin/offer/OfferHeader.tsx
// Ensotek – Offer Admin List Header (Bootstrap style)
//   - Arama + Status filtre + Aksiyonlar
// =============================================================

"use client";

import React from "react";
import type { OfferStatus } from "@/integrations/types";

export interface OfferHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;

  status: OfferStatus | "";
  onStatusChange: (v: OfferStatus | "") => void;

  loading: boolean;
  onRefresh: () => void;
  onCreateClick: () => void;
}

const STATUS_OPTIONS: { value: OfferStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In Review" },
  { value: "quoted", label: "Quoted" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export const OfferHeader: React.FC<OfferHeaderProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  loading,
  onRefresh,
  onCreateClick,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value as OfferStatus | "";
    onStatusChange(raw || "");
  };

  return (
    <div className="row mb-3 g-2 align-items-end">
      {/* Sol: Arama + Status */}
      <div className="col-md-7">
        <div className="card">
          <div className="card-body py-2">
            <div className="row g-2 align-items-end">
              {/* Arama */}
              <div className="col-12 col-md-7">
                <label className="form-label small mb-1">
                  Ara (müşteri / firma / email / konu)
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ör: 'Müller' veya 'cooling tower'..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="col-6 col-md-3">
                <label className="form-label small mb-1">
                  Durum
                </label>
                <select
                  className="form-select form-select-sm"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="">Tüm durumlar</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Boş alan / future filtreler için */}
              <div className="col-6 col-md-2">
                <label className="form-label small mb-1 d-none d-md-block">
                  &nbsp;
                </label>
                <div className="small text-muted">
                  {/* ileride country / locale filtre vs gelebilir */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ: Aksiyonlar */}
      <div className="col-md-5">
        <div className="card">
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <div className="small text-muted">
                Teklif taleplerini yönet, PDF üret ve e-posta gönder.
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={onRefresh}
                  disabled={loading}
                >
                  {loading ? "Yenileniyor..." : "Yenile"}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onCreateClick}
                  disabled={loading}
                >
                  Yeni Teklif
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
