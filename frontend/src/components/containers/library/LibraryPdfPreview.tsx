"use client";

import React, { useMemo } from "react";

type Props = {
  pdfUrl: string | null;
  title?: string;
  height?: number;
};

import { safeStr, resolveMediaUrl } from "@/lib/media";

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

function buildIframeSrc(pdfUrl: string | null): string | null {
  const resolved = resolveMediaUrl(pdfUrl);
  if (!resolved) return null;
  return normalizeCloudinaryPdfUrl(resolved);
}

const LibraryPdfPreview: React.FC<Props> = ({ pdfUrl, title = "PDF Preview", height = 620 }) => {
  const iframeSrc = useMemo(() => buildIframeSrc(pdfUrl), [pdfUrl]);

  if (!iframeSrc) return null;

  return (
    <div className="ens-pdfPreview">
      <div className="ens-pdfPreview__frame" style={{ height }}>
        <iframe 
          title={title} 
          src={`${iframeSrc}#toolbar=0&navpanes=0&scrollbar=0`} 
          width="100%" 
          height="100%" 
          loading="lazy"
          style={{ border: 'none', display: 'block' }}
        >
          <p>
            Your browser does not support iframes. 
            <a href={iframeSrc} target="_blank" rel="noreferrer">Download the PDF</a>
          </p>
        </iframe>
      </div>
      <div className="mt-15 text-center">
        <a 
          href={iframeSrc} 
          target="_blank" 
          rel="noreferrer" 
          className="tp-btn tp-btn-2"
          style={{ padding: '10px 25px', fontSize: '14px' }}
        >
          <i className="fa-light fa-file-pdf mr-10"></i>
          Open / Download PDF
        </a>
      </div>
    </div>
  );
};

export default LibraryPdfPreview;
