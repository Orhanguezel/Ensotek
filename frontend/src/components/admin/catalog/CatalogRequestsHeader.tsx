// =============================================================
// FILE: src/components/admin/catalog/CatalogRequestsHeader.tsx
// Ensotek – Admin Catalog Requests Header / Filters (Bootstrap pattern)
// =============================================================

import React from "react";
import { CATALOG_STATUS_OPTIONS } from "./CatalogStatus";
import type { CatalogRequestStatus } from "@/integrations/types/catalog.types";

export type LocaleOption = {
    value: string;
    label: string;
};

export type CatalogFilters = {
    search: string;
    status: "" | CatalogRequestStatus;
    locale: string;
};

export type CatalogRequestsHeaderProps = {
    filters: CatalogFilters;
    total: number;
    loading: boolean;

    locales: LocaleOption[];
    localesLoading?: boolean;
    defaultLocale?: string;

    onFiltersChange: (next: CatalogFilters) => void;
    onRefresh: () => void;
};

export const CatalogRequestsHeader: React.FC<CatalogRequestsHeaderProps> = ({
    filters,
    total,
    loading,
    locales,
    localesLoading,
    defaultLocale,
    onFiltersChange,
    onRefresh,
}) => {
    const handleChange =
        (field: keyof CatalogFilters) =>
            (
                e:
                    | React.ChangeEvent<HTMLInputElement>
                    | React.ChangeEvent<HTMLSelectElement>,
            ) => {
                const value = e.target.value;
                onFiltersChange({ ...filters, [field]: value });
            };

    const effectiveDefaultLocale = defaultLocale ?? "tr";

    return (
        <div className="card mb-3">
            <div className="card-body py-2">
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <div className="me-auto d-flex flex-wrap gap-2 align-items-center">
                        <div>
                            <div className="small text-muted">Toplam Talep</div>
                            <div className="fw-semibold">{total}</div>
                        </div>

                        <div className="ms-3">
                            <label className="form-label small mb-1">Ara</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="İsim, şirket veya e-posta..."
                                value={filters.search}
                                onChange={handleChange("search")}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="form-label small mb-1">Status</label>
                            <select
                                className="form-select form-select-sm"
                                value={filters.status}
                                onChange={handleChange("status")}
                                disabled={loading}
                            >
                                <option value="">Hepsi</option>
                                {CATALOG_STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="form-label small mb-1">Locale</label>
                            <select
                                className="form-select form-select-sm"
                                value={filters.locale}
                                onChange={handleChange("locale")}
                                disabled={loading || (localesLoading && !locales.length)}
                            >
                                <option value="">
                                    (Varsayılan
                                    {effectiveDefaultLocale ? `: ${effectiveDefaultLocale}` : ""}
                                    )
                                </option>
                                {locales.map((loc) => (
                                    <option key={loc.value} value={loc.value}>
                                        {loc.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={onRefresh}
                            disabled={loading}
                        >
                            Yenile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
