// =============================================================
// FILE: src/components/admin/offer/OfferPdfPreview.tsx
// =============================================================

"use client";

import React, { useMemo } from "react";

interface OfferPdfPreviewProps {
    pdfUrl: string | null;
}

const FILE_BASE =
    process.env.NEXT_PUBLIC_FILE_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:8086";

function buildIframeSrc(pdfUrl: string | null): string | null {
    if (!pdfUrl) return null;
    if (/^https?:\/\//i.test(pdfUrl)) return pdfUrl;
    if (pdfUrl.startsWith("/")) return `${FILE_BASE}${pdfUrl}`;
    return `${FILE_BASE}/${pdfUrl}`;
}

export const OfferPdfPreview: React.FC<OfferPdfPreviewProps> = ({ pdfUrl }) => {
    const iframeSrc = useMemo(() => buildIframeSrc(pdfUrl), [pdfUrl]);

    if (!iframeSrc) {
        return (
            <div className="alert alert-secondary small mb-0">
                Henüz PDF oluşturulmamış veya PDF URL boş.
            </div>
        );
    }

    return (
        <div>
            <div className="border rounded p-2" style={{ height: "600px" }}>
                <iframe
                    title="Offer PDF Preview"
                    src={iframeSrc}
                    style={{ width: "100%", height: "100%", border: "none" }}
                />
            </div>
            <div className="small text-muted mt-1">
                PDF doğrudan tarayıcı içinde açılmıyorsa{" "}
                <a href={iframeSrc} target="_blank" rel="noreferrer">
                    bu bağlantıya tıklayarak yeni sekmede görüntüleyebilirsiniz
                </a>
                .
                <br />
                <code className="text-muted">{iframeSrc}</code>
            </div>
        </div>
    );
};
