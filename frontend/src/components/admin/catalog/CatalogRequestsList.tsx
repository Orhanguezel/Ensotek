// =============================================================
// FILE: src/components/admin/catalog/CatalogRequestsList.tsx
// Ensotek – Admin Catalog Requests Table (Bootstrap pattern)
// =============================================================

import React from "react";
import { useRouter } from "next/router";
import type { CatalogRequestDto } from "@/integrations/types/catalog.types";
import { statusBadgeClass } from "./CatalogStatus";

export type CatalogRequestsListProps = {
    items: CatalogRequestDto[];
    loading: boolean;
    onDelete: (item: CatalogRequestDto) => void;
};

const fmtDate = (value: string | null | undefined) => {
    if (!value) return "-";
    try {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return d.toLocaleString("tr-TR");
    } catch {
        return value;
    }
};

export const CatalogRequestsList: React.FC<CatalogRequestsListProps> = ({
    items,
    loading,
    onDelete,
}) => {
    const router = useRouter();

    const handleRowClick = (item: CatalogRequestDto) => {
        router.push(`/admin/catalog-requests/${encodeURIComponent(item.id)}`);
    };

    const handleDeleteClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        item: CatalogRequestDto,
    ) => {
        e.stopPropagation();
        if (!loading) onDelete(item);
    };

    if (!loading && items.length === 0) {
        return (
            <div className="card">
                <div className="card-body py-4 text-center text-muted small">
                    Henüz katalog talebi yok.
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Status</th>
                            <th>Müşteri</th>
                            <th>E-posta</th>
                            <th>Şirket</th>
                            <th>Locale</th>
                            <th>Sent</th>
                            <th>Oluşturulma</th>
                            <th style={{ width: "120px" }}>İşlemler</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((r) => (
                            <tr
                                key={r.id}
                                onClick={() => handleRowClick(r)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>
                                    <span className={statusBadgeClass(r.status)}>{r.status}</span>
                                </td>
                                <td className="fw-semibold">{r.customer_name}</td>
                                <td className="text-muted small">{r.email}</td>
                                <td className="text-muted small">{r.company_name ?? "-"}</td>
                                <td className="text-muted small">{r.locale ?? "-"}</td>
                                <td className="text-muted small">
                                    {r.email_sent_at ? fmtDate(r.email_sent_at) : "-"}
                                </td>
                                <td className="text-muted small">{fmtDate(r.created_at)}</td>
                                <td>
                                    <div className="btn-group btn-group-sm">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRowClick(r);
                                            }}
                                        >
                                            Gör
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={(e) => handleDeleteClick(e, r)}
                                            disabled={loading}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {loading && (
                            <tr>
                                <td colSpan={8} className="text-center py-3 text-muted small">
                                    Yükleniyor...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
