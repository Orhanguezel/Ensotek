// =============================================================
// FILE: src/components/admin/references/ReferencesFormImageColumn.tsx
// Sağ kolon – Referans görseli (featured_image)
// =============================================================

"use client";

import React from "react";

export type ReferenceImageMetadata = {
  module_key: "references";
  locale: string;
  reference_slug?: string;
  reference_id?: string;
};

export type ReferencesFormImageColumnProps = {
  metadata?: ReferenceImageMetadata;
  imageUrl: string;
  disabled: boolean;
  onImageUrlChange: (url: string) => void;
};

export const ReferencesFormImageColumn: React.FC<
  ReferencesFormImageColumnProps
> = ({ metadata, imageUrl, disabled, onImageUrlChange }) => {
  return (
    <div className="card">
      <div className="card-header">
        <strong>Referans Görseli</strong>
      </div>
      <div className="card-body">
        <div className="mb-2">
          <label className="form-label small">
            Öne çıkan görsel URL (featured_image)
          </label>
          <input
            className="form-control form-control-sm"
            disabled={disabled}
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
          />
        </div>

        {imageUrl ? (
          <div className="border rounded overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={metadata?.reference_slug || "Reference image"}
              style={{ width: "100%", display: "block", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="text-muted small">
            Henüz bir görsel URL’i girilmedi.
          </div>
        )}
      </div>
    </div>
  );
};
