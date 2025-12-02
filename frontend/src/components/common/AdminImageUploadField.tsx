// =============================================================
// FILE: src/components/admin/common/AdminImageUploadField.tsx
// Admin – Ortak Görsel Yükleme Alanı (Storage + Preview)
// =============================================================

"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import { useCreateAssetAdminMutation } from "@/integrations/rtk/endpoints/admin/storage_admin.endpoints";

export type AdminImageUploadFieldProps = {
  /** Kart başlığı */
  label?: string;
  /** Açıklama / helper text (optional) */
  helperText?: React.ReactNode;

  /** Storage bucket (örn: "public") */
  bucket?: string;
  /** Storage folder (örn: "categories", "products/cover" vs.) */
  folder?: string;

  /** Storage metadata (örn: { module_key, locale, slug }) */
  metadata?: Record<string, string | number | boolean>;

  /** Seçili görsel URL’i (input state) */
  value?: string;
  /** Üst componente URL değişimini bildirmek için */
  onChange?: (url: string) => void;

  /** Yükleme / form kilit durumu */
  disabled?: boolean;

  /** Kütüphane butonuna basıldığında gidilecek link (opsiyonel) */
  openLibraryHref?: string;
  /** Kütüphane butonuna özel onClick (href yerine) */
  onOpenLibraryClick?: () => void;
};

export const AdminImageUploadField: React.FC<AdminImageUploadFieldProps> = ({
  label = "Görsel",
  helperText,
  bucket = "public",
  folder = "uploads",
  metadata,
  value,
  onChange,
  disabled,
  openLibraryHref,
  onOpenLibraryClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createAssetAdmin, { isLoading: isUploading }] =
    useCreateAssetAdminMutation();

  const handlePickClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      // Metadata değerlerini string'e çevir (backend tarafı için safe)
      const meta: Record<string, string> | undefined = metadata
        ? Object.fromEntries(
            Object.entries(metadata).map(([k, v]) => [k, String(v)]),
          )
        : undefined;

      const res = await createAssetAdmin({
        file,
        bucket,
        folder,
        metadata: meta,
      }).unwrap();

      const url = (res as any)?.url as string | undefined;

      if (url) {
        onChange?.(url);
        toast.success("Görsel yüklendi.");
      } else {
        toast.error("Görsel URL'i alınamadı.");
        console.warn("AdminImageUploadField: storage cevabında url yok:", res);
      }
    } catch (err: any) {
      console.error("AdminImageUploadField upload error:", err);
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Görsel yüklenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleOpenLibrary = (e: React.MouseEvent) => {
    if (onOpenLibraryClick) {
      e.preventDefault();
      onOpenLibraryClick();
      return;
    }
    if (!openLibraryHref) return;
    // default davranış: href’e git (anchor ise)
  };

  return (
    <div className="border rounded-2 p-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="small fw-semibold">{label}</span>
        {isUploading && (
          <span className="badge bg-secondary small">
            Yükleniyor...
          </span>
        )}
      </div>

      {helperText && (
        <p className="text-muted small mb-2">{helperText}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="d-none"
        onChange={handleFileChange}
      />

      <div className="mb-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={handlePickClick}
          disabled={disabled || isUploading}
        >
          Görsel Yükle
        </button>

        {openLibraryHref || onOpenLibraryClick ? (
          <a
            href={openLibraryHref || "#"}
            className="btn btn-link btn-sm ms-2 px-1"
            onClick={handleOpenLibrary}
          >
            Kütüphaneyi aç
          </a>
        ) : null}
      </div>

      {value ? (
        <div className="border rounded-2 p-2 bg-light">
          <div className="small text-muted mb-1">Önizleme</div>
          <div
            className="ratio ratio-16x9 bg-white border rounded overflow-hidden"
            style={{ maxHeight: 220 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Görsel"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="small text-muted mt-1">
            <code className="small">{value}</code>
          </div>
        </div>
      ) : (
        <div className="border rounded-2 p-3 bg-light text-center text-muted small">
          Henüz görsel seçilmedi. Yüklediğinde burada önizleme görünür.
        </div>
      )}
    </div>
  );
};
