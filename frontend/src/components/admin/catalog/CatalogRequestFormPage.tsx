// =============================================================
// FILE: src/components/admin/catalog/CatalogRequestFormPage.tsx
// Ensotek – Admin Catalog Request Detail (Update + Resend + Delete)
// Bootstrap pattern
// =============================================================

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import type { CatalogRequestDto } from "@/integrations/types/catalog.types";
import {
    useGetCatalogRequestAdminQuery,
    usePatchCatalogRequestAdminMutation,
    useRemoveCatalogRequestAdminMutation,
    useResendCatalogRequestAdminMutation,
} from "@/integrations/rtk/endpoints/admin/catalog_admin.endpoints";

import { CATALOG_STATUS_OPTIONS, statusBadgeClass } from "./CatalogStatus";

type FormValues = {
    status: string;
    admin_notes: string;
};

const buildInitialValues = (initial?: CatalogRequestDto): FormValues => {
    if (!initial) {
        return { status: "new", admin_notes: "" };
    }
    return {
        status: initial.status ?? "new",
        admin_notes: initial.admin_notes ?? "",
    };
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

export const CatalogRequestFormPage: React.FC<{ id: string }> = ({ id }) => {
    const router = useRouter();

    const {
        data,
        isLoading,
        isFetching,
        error,
    } = useGetCatalogRequestAdminQuery({ id });

    const [patchReq, { isLoading: isSaving }] =
        usePatchCatalogRequestAdminMutation();
    const [removeReq, { isLoading: isDeleting }] =
        useRemoveCatalogRequestAdminMutation();
    const [resendReq, { isLoading: isResending }] =
        useResendCatalogRequestAdminMutation();

    const [values, setValues] = useState<FormValues>(buildInitialValues());

    useEffect(() => {
        setValues(buildInitialValues(data));
    }, [data]);

    const loading = isLoading || isFetching;
    const busy = loading || isSaving || isDeleting || isResending;

    const statusOptions = useMemo(() => CATALOG_STATUS_OPTIONS, []);

    const handleChange =
        (field: keyof FormValues) =>
            (
                e:
                    | React.ChangeEvent<HTMLInputElement>
                    | React.ChangeEvent<HTMLTextAreaElement>
                    | React.ChangeEvent<HTMLSelectElement>,
            ) => {
                const val = e.target.value;
                setValues((prev) => ({ ...prev, [field]: val }));
            };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (busy) return;

        try {
            await patchReq({
                id,
                body: {
                    status: (values.status as any) || undefined,
                    admin_notes: values.admin_notes ? values.admin_notes : null,
                },
            }).unwrap();

            toast.success("Kaydedildi.");
        } catch (err: any) {
            const msg =
                err?.data?.error?.message || err?.message || "Kaydetme başarısız.";
            toast.error(msg);
        }
    };

    const handleResend = async () => {
        if (busy) return;
        try {
            await resendReq({ id }).unwrap();
            toast.success("Katalog e-postası tekrar gönderildi.");
        } catch (err: any) {
            const msg =
                err?.data?.error?.message || err?.message || "Resend başarısız.";
            toast.error(msg);
        }
    };

    const handleDelete = async () => {
        if (busy) return;
        try {
            await removeReq({ id }).unwrap();
            toast.success("Silindi.");
            router.push("/admin/catalog-requests");
        } catch (err: any) {
            const msg =
                err?.data?.error?.message || err?.message || "Silme başarısız.";
            toast.error(msg);
        }
    };

    if (!loading && error && !data) {
        return (
            <div className="container-fluid py-3">
                <h4 className="h5 mb-2">Kayıt bulunamadı</h4>
                <p className="text-muted small mb-3">
                    Bu id için katalog talebi yok: <code className="ms-1">{id}</code>
                </p>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => router.push("/admin/catalog-requests")}
                >
                    Listeye dön
                </button>
            </div>
        );
    }

    const row = data;

    return (
        <div className="container-fluid py-3">
            <div className="mb-3 d-flex align-items-center justify-content-between gap-2">
                <div>
                    <h4 className="h5 mb-1">Catalog Request</h4>
                    <div className="text-muted small">
                        Status, admin notu ve e-posta gönderimini buradan yönetebilirsin.
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => router.push("/admin/catalog-requests")}
                        disabled={busy}
                    >
                        Geri
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleResend}
                        disabled={busy}
                    >
                        {isResending ? "Gönderiliyor..." : "Resend mail"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleDelete}
                        disabled={busy}
                    >
                        {isDeleting ? "Siliniyor..." : "Sil"}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-header py-2 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <span className="small fw-semibold">Detay</span>
                            {row?.status ? (
                                <span className={statusBadgeClass(row.status)}>{row.status}</span>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                            disabled={busy}
                        >
                            {isSaving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                    </div>

                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-lg-6">
                                <div className="row g-2 mb-3">
                                    <div className="col-sm-6">
                                        <label className="form-label small mb-1">Status</label>
                                        <select
                                            className="form-select form-select-sm"
                                            value={values.status}
                                            onChange={handleChange("status")}
                                            disabled={busy}
                                        >
                                            {statusOptions.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="form-label small mb-1">Locale</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={row?.locale ?? ""}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-3">
                                    <div className="col-sm-6">
                                        <label className="form-label small mb-1">Customer</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={row?.customer_name ?? ""}
                                            readOnly
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="form-label small mb-1">Company</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={row?.company_name ?? ""}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-3">
                                    <div className="col-sm-6">
                                        <label className="form-label small mb-1">Email</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={row?.email ?? ""}
                                            readOnly
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="form-label small mb-1">Phone</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={row?.phone ?? ""}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="row g-2 mb-0">
                                    <div className="col-sm-6">
                                        <label className="form-label small mb-1">Email sent</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={row?.email_sent_at ? fmtDate(row.email_sent_at) : ""}
                                            readOnly
                                        />
                                    </div>

                                    <div className="col-sm-6">
                                        <label className="form-label small mb-1">Created</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={row?.created_at ? fmtDate(row.created_at) : ""}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label className="form-label small mb-1">Message</label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={6}
                                        value={row?.message ?? ""}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-0">
                                    <label className="form-label small mb-1">Admin notes</label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={6}
                                        value={values.admin_notes}
                                        onChange={handleChange("admin_notes")}
                                        disabled={busy}
                                        placeholder="İç not..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 small text-muted">
                            Pazarlama onayı: <strong>{row?.consent_marketing ? "Evet" : "Hayır"}</strong>{" "}
                            • Terms onayı: <strong>{row?.consent_terms ? "Evet" : "Hayır"}</strong>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
