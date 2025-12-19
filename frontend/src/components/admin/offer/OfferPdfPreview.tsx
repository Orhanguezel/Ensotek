// =============================================================
// FILE: src/components/admin/offer/OfferPdfPreview.tsx
//  - Prod + locale bağımsız çalışır
//  - API EKLEMEZ
//  - Relative URL -> FILE_BASE + /uploads/... absolute
//  - ✅ LOCAL: frontend 3000 olsa bile backend file origin default 8086
// =============================================================

"use client";

import React, { useMemo } from "react";

interface OfferPdfPreviewProps {
  pdfUrl: string | null;
}

/**
 * FILE_BASE (backend public origin):
 * 1) NEXT_PUBLIC_FILE_BASE_URL (en doğru kaynak)
 * 2) NEXT_PUBLIC_PUBLIC_BASE_URL (opsiyonel)
 * 3) LOCAL (localhost/127.0.0.1): varsayılan http://localhost:8086
 * 4) PROD: window.location.origin
 * 5) fallback: http://localhost:8086
 */
function getFileBase(): string {
  const envBase =
    (process.env.NEXT_PUBLIC_FILE_BASE_URL ||
      (process.env as any).NEXT_PUBLIC_PUBLIC_BASE_URL ||
      "") as string;

  const cleanedEnv = envBase.trim().replace(/\/+$/, "");
  if (cleanedEnv) return cleanedEnv;

  if (typeof window !== "undefined" && window.location) {
    const { hostname, origin } = window.location;

    // ✅ Local dev: admin FE genelde 3000; files BE genelde 8086
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8086";
    }

    // ✅ Prod: aynı origin üzerinden servis ediliyorsa doğru
    return (origin || "").replace(/\/+$/, "");
  }

  return "http://localhost:8086";
}

/**
 * pdfUrl normalize (defansif):
 * - absolute ise dokunma
 * - relative ise:
 *    "/api/uploads/.." -> "/uploads/.."
 *    "api/uploads/.."  -> "/uploads/.."
 *    "/uploads/.."     -> aynen
 */
function normalizePdfPath(pdfUrl: string): string {
  const s = (pdfUrl || "").trim();
  if (!s) return "/uploads";

  // absolute ise aynen
  if (/^https?:\/\//i.test(s)) return s;

  // query/hash koru
  const [pathOnly, suffix = ""] = s.split(/(?=[?#])/);

  // origin kaçarsa temizle
  const cleaned = pathOnly.replace(/^https?:\/\/[^/]+/i, "");
  let p = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;

  // /api/api/... düzelt
  while (p.startsWith("/api/api/")) p = p.replace("/api/api/", "/api/");

  // /api/uploads -> /uploads
  if (p === "/api/uploads") return `/uploads${suffix}`;
  if (p.startsWith("/api/uploads/")) return `${p.replace(/^\/api/, "")}${suffix}`;

  // /uploads -> aynen
  if (p === "/uploads" || p.startsWith("/uploads/")) return `${p}${suffix}`;

  const idx = p.indexOf("/uploads/");
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  // son çare
  return `/uploads${p}${suffix}`;
}

function buildIframeSrc(pdfUrl: string | null): string | null {
  if (!pdfUrl) return null;

  // absolute ise direkt
  if (/^https?:\/\//i.test(pdfUrl)) return pdfUrl;

  const fileBase = getFileBase();
  const normalized = normalizePdfPath(pdfUrl);

  return `${fileBase}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
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
        PDF tarayıcı içinde açılmıyorsa{" "}
        <a href={iframeSrc} target="_blank" rel="noreferrer">
          yeni sekmede görüntüleyin
        </a>
        .
        <br />
        <code className="text-muted">{iframeSrc}</code>
      </div>
    </div>
  );
};
