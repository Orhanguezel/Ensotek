"use client";

import React, { useMemo } from "react";

type Props = {
  pdfUrl: string | null;
  title?: string;
  height?: number;
};

const safeStr = (v: unknown) => String(v ?? "").trim();

function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s);
}

function stripTrailingSlash(s: string): string {
  return String(s || "").replace(/\/+$/, "");
}

function originFromUrl(u: string): string | null {
  try {
    const x = new URL(u);
    return `${x.protocol}//${x.host}`;
  } catch {
    return null;
  }
}

function getFileBase(): string {
  const envBase = stripTrailingSlash(safeStr(process.env.NEXT_PUBLIC_FILE_BASE_URL || ""));
  if (envBase) return envBase;

  const backendLike = stripTrailingSlash(
    safeStr(
      (process.env as any).NEXT_PUBLIC_BACKEND_URL ||
        (process.env as any).NEXT_PUBLIC_API_BASE_URL ||
        (process.env as any).NEXT_PUBLIC_API_URL ||
        "",
    ),
  );
  if (backendLike) {
    const o = originFromUrl(backendLike);
    return o ? stripTrailingSlash(o) : backendLike;
  }

  if (typeof window !== "undefined" && window.location) {
    const host = safeStr(window.location.hostname);
    const origin = stripTrailingSlash(safeStr(window.location.origin));

    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8086";
    }

    if (origin) return origin;
  }

  return "https://www.ensotek.de";
}

function normalizeCloudinaryPdfUrl(input: string): string {
  const url = safeStr(input);
  if (!url) return "";

  const lower = url.toLowerCase();
  if (!lower.includes("res.cloudinary.com")) return url;

  const base = lower.split("?")[0].split("#")[0];
  if (!base.endsWith(".pdf")) return url;

  if (lower.includes("/raw/upload/")) return url;

  if (lower.includes("/image/upload/")) {
    return url.replace("/image/upload/", "/raw/upload/");
  }

  return url;
}

function normalizePdfPath(pdfUrl: string): string {
  const s = safeStr(pdfUrl);
  if (!s) return "/uploads";

  if (isHttpUrl(s)) return s;

  const [pathOnly, suffix = ""] = s.split(/(?=[?#])/);
  const cleaned = String(pathOnly).replace(/^https?:\/\/[^/]+/i, "");
  let p = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;

  while (p.startsWith("/api/api/")) p = p.replace("/api/api/", "/api/");

  if (p === "/api/uploads") return `/uploads${suffix}`;
  if (p.startsWith("/api/uploads/")) return `${p.replace(/^\/api/, "")}${suffix}`;
  if (p === "/uploads" || p.startsWith("/uploads/")) return `${p}${suffix}`;

  const idx = p.indexOf("/uploads/");
  if (idx >= 0) return `${p.substring(idx)}${suffix}`;

  return `/uploads/${p.replace(/^\/+/, "")}${suffix}`.replace(
    /^\/uploads\/uploads(\/|$)/,
    "/uploads$1",
  );
}

function buildIframeSrc(pdfUrl: string | null): string | null {
  const raw = safeStr(pdfUrl);
  if (!raw) return null;

  if (isHttpUrl(raw)) {
    return normalizeCloudinaryPdfUrl(raw);
  }

  const fileBase = getFileBase();
  const normalized = normalizePdfPath(raw);
  const base = stripTrailingSlash(fileBase);

  return `${base}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
}

const LibraryPdfPreview: React.FC<Props> = ({ pdfUrl, title = "PDF Preview", height = 600 }) => {
  const iframeSrc = useMemo(() => buildIframeSrc(pdfUrl), [pdfUrl]);

  if (!iframeSrc) return null;

  return (
    <div className="ens-pdfPreview">
      <div className="ens-pdfPreview__frame">
        <iframe title={title} src={iframeSrc} width="100%" height={height} loading="lazy" />
      </div>
    </div>
  );
};

export default LibraryPdfPreview;
