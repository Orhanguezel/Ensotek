'use client';

import React, { useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useCreateAssetAdminMutation } from '@/integrations/rtk/hooks';

export type AdminImageUploadFieldProps = {
  label?: string;
  helperText?: React.ReactNode;

  bucket?: string;
  folder?: string;
  metadata?: Record<string, string | number | boolean>;

  value?: string;
  onChange?: (url: string) => void;

  values?: string[];
  onChangeMultiple?: (urls: string[]) => void;

  onSelectAsCover?: (url: string) => void;
  coverValue?: string;

  disabled?: boolean;

  openLibraryHref?: string;
  onOpenLibraryClick?: () => void;

  multiple?: boolean;
};

const toMeta = (metadata?: Record<string, string | number | boolean>) => {
  if (!metadata) return undefined;
  return Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, String(v)]));
};

const uniqAppend = (arr: string[], items: string[]) => {
  const set = new Set(arr);
  const out = [...arr];
  for (const it of items) {
    const v = (it || '').trim();
    if (v && !set.has(v)) {
      set.add(v);
      out.push(v);
    }
  }
  return out;
};

const UrlLine: React.FC<{ url: string; disabled?: boolean }> = ({ url, disabled }) => {
  const safe = (url || '').trim();
  if (!safe) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(safe);
      toast.success('URL kopyalandı.');
    } catch {
      toast.error('Kopyalanamadı.');
    }
  };

  return (
    <div className="d-flex align-items-center gap-2 mt-2">
      <div className="flex-grow-1 ensotek-min-w-0">
        <div className="text-muted small text-truncate" title={safe}>
          {safe}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={copy}
        disabled={disabled}
        title="Kopyala"
      >
        Kopyala
      </button>
    </div>
  );
};

export const AdminImageUploadField: React.FC<AdminImageUploadFieldProps> = ({
  label = 'Görsel',
  helperText,
  bucket = 'public',
  folder = 'uploads',
  metadata,

  value,
  onChange,

  values,
  onChangeMultiple,
  onSelectAsCover,
  coverValue,

  disabled,
  openLibraryHref,
  onOpenLibraryClick,
  multiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createAssetAdmin, { isLoading: isUploading }] = useCreateAssetAdminMutation();

  const meta = useMemo(() => toMeta(metadata), [metadata]);
  const gallery = useMemo(() => (Array.isArray(values) ? values : []), [values]);

  const handlePickClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;

    // SINGLE
    if (!multiple) {
      const file = files[0];
      try {
        const res = await createAssetAdmin({ file, bucket, folder, metadata: meta }).unwrap();
        const url = (res as any)?.url as string | undefined;

        if (url) {
          onChange?.(url);
          toast.success('Görsel yüklendi.');
        } else {
          toast.error("Görsel URL'i alınamadı.");
          // eslint-disable-next-line no-console
          console.warn('AdminImageUploadField: storage cevabında url yok:', res);
        }
      } catch (err: any) {
        const msg =
          err?.data?.error?.message || err?.message || 'Görsel yüklenirken bir hata oluştu.';
        toast.error(msg);
      }
      return;
    }

    // MULTIPLE
    const uploadedUrls: string[] = [];
    let successCount = 0;

    for (const file of files) {
      try {
        const res = await createAssetAdmin({ file, bucket, folder, metadata: meta }).unwrap();
        const url = (res as any)?.url as string | undefined;

        if (url) {
          uploadedUrls.push(url);
          successCount += 1;

          // legacy fallback: onChange per-url (LibraryImagesSection gibi kullanım)
          if (!onChangeMultiple) onChange?.(url);
        }
      } catch (err: any) {
        const msg =
          err?.data?.error?.message ||
          err?.message ||
          'Bazı görseller yüklenirken bir hata oluştu.';
        toast.error(msg);
      }
    }

    if (successCount > 0) {
      if (onChangeMultiple) {
        const next = uniqAppend(gallery, uploadedUrls);
        onChangeMultiple(next);
      }
      toast.success(successCount === 1 ? 'Görsel yüklendi.' : `${successCount} görsel yüklendi.`);
    }
  };

  const handleOpenLibrary = (e: React.MouseEvent) => {
    if (onOpenLibraryClick) {
      e.preventDefault();
      onOpenLibraryClick();
      return;
    }
    if (!openLibraryHref) return;
  };

  const removeAt = (idx: number) => {
    if (!onChangeMultiple) return;
    onChangeMultiple(gallery.filter((_, i) => i !== idx));
  };

  const move = (from: number, dir: -1 | 1) => {
    if (!onChangeMultiple) return;
    const to = from + dir;
    if (to < 0 || to >= gallery.length) return;
    const next = [...gallery];
    const tmp = next[from];
    next[from] = next[to];
    next[to] = tmp;
    onChangeMultiple(next);
  };

  const isMulti = !!multiple;

  return (
    <div className="border rounded-2 p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="small fw-semibold">{label}</span>
        {isUploading && <span className="badge bg-secondary small">Yükleniyor...</span>}
      </div>

      {helperText && <div className="text-muted small mb-2">{helperText}</div>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={isMulti}
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
          {isMulti ? 'Görseller Yükle' : 'Görsel Yükle'}
        </button>

        {openLibraryHref || onOpenLibraryClick ? (
          <a
            href={openLibraryHref || '#'}
            className="btn btn-link btn-sm ms-2 px-1"
            onClick={handleOpenLibrary}
          >
            Kütüphaneyi aç
          </a>
        ) : null}
      </div>

      {/* PREVIEW */}
      {!isMulti ? (
        value ? (
          <div className="border rounded-2 p-2 bg-light">
            <div className="small text-muted mb-1">Önizleme</div>

            <div className="ratio ratio-16x9 bg-white border rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Görsel"
                className="ensotek-admin-img-cover w-100 h-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            <UrlLine url={value} disabled={disabled} />
          </div>
        ) : (
          <div className="border rounded-2 p-3 bg-light text-center text-muted small">
            Henüz görsel seçilmedi. Yüklediğinde burada önizleme görünür.
          </div>
        )
      ) : gallery.length > 0 ? (
        <div>
          <div className="small text-muted mb-2">Galeri</div>

          <div className="row g-2">
            {gallery.map((u, idx) => {
              const isCover = !!coverValue && coverValue === u;

              return (
                <div className="col-6" key={`${u}-${idx}`}>
                  <div className={`border rounded-2 p-2 ${isCover ? 'border-primary' : ''}`}>
                    <div className="ratio ratio-16x9 bg-white border rounded overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u}
                        alt={`image-${idx + 1}`}
                        className="ensotek-admin-img-cover w-100 h-100"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-2 gap-1">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          disabled={disabled || isUploading || !onChangeMultiple || idx === 0}
                          onClick={() => move(idx, -1)}
                          title="Yukarı"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          disabled={
                            disabled ||
                            isUploading ||
                            !onChangeMultiple ||
                            idx === gallery.length - 1
                          }
                          onClick={() => move(idx, 1)}
                          title="Aşağı"
                        >
                          ↓
                        </button>
                      </div>

                      <div className="d-flex gap-1">
                        {onSelectAsCover && (
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              isCover ? 'btn-primary' : 'btn-outline-primary'
                            }`}
                            disabled={disabled || isUploading}
                            onClick={() => {
                              onSelectAsCover(u);
                              toast.success('Kapak görseli güncellendi.');
                            }}
                            title="Kapak yap"
                          >
                            Kapak
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          disabled={disabled || isUploading || !onChangeMultiple}
                          onClick={() => removeAt(idx)}
                          title="Sil"
                        >
                          Sil
                        </button>
                      </div>
                    </div>

                    <UrlLine url={u} disabled={disabled || isUploading} />
                  </div>
                </div>
              );
            })}
          </div>

          {!onChangeMultiple && (
            <div className="form-text small mt-2">
              Not: <code>onChangeMultiple</code> verilmediği için galeri listesi parent tarafından
              yönetilmiyor.
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-2 p-3 bg-light text-center text-muted small">
          Henüz galeri görseli yok. “Görseller Yükle” ile eklediğinde burada listelenecek.
        </div>
      )}
    </div>
  );
};
