// =============================================================
// FILE: src/components/admin/library/LibraryFilesSection.tsx
// Ensotek – Admin Library Files Section [FINAL - LOCAL FIRST]
// FIX (MINIMAL):
// - Send locale to list/create/delete (x-locale header RTK tarafında var)
// - Default bucket "uploads" caused 400 on /admin/storage/assets (backend likely whitelists buckets)
//   => default bucket set to "public" (works with most setups)
// - Keep local-first expectation: folder default "uploads/catalog" (adjust if backend expects "catalog")
// - Delete: treat 404 as success (idempotent), always refetch
// EXTRA (SAFE):
// - locale normalize (avoid undefined propagation)
// - refetch calls are non-blocking (avoid promise lint issues)
// - safer asset response parsing
// =============================================================

'use client';

import React, { useRef, useState, useMemo } from 'react';
import { toast } from 'sonner';

import type { LibraryFileDto } from '@/integrations/types';

import {
  useListLibraryFilesAdminQuery,
  useCreateLibraryFileAdminMutation,
  useRemoveLibraryFileAdminMutation,
  useCreateAssetAdminMutation,
} from '@/integrations/rtk/hooks';

export type LibraryFilesSectionProps = {
  libraryId: string;
  locale?: string; // ✅ locale support
  disabled?: boolean; // ✅ was required; make optional to be safe
};

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const norm = (v: unknown) => String(v ?? '').trim();

function normalizeLocale(raw?: string, fallback = 'de') {
  const s = String(raw ?? '').trim();
  if (!s) return fallback;
  const [short] = s.split('-');
  return (short || fallback).toLowerCase();
}

function extractErrMsg(err: any): string {
  const data = err?.data;
  return (
    data?.error?.message ||
    data?.message ||
    err?.error ||
    err?.message ||
    'İşlem sırasında hata oluştu.'
  );
}

export const LibraryFilesSection: React.FC<LibraryFilesSectionProps> = ({
  libraryId,
  locale,
  disabled = false,
}) => {
  const effectiveLocale = useMemo(() => normalizeLocale(locale, 'de'), [locale]);

  const {
    data: files,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryFilesAdminQuery(
    { id: libraryId, locale: effectiveLocale }, // ✅ locale normalized
    { skip: !libraryId },
  );

  const [createFile, { isLoading: isCreatingFile }] = useCreateLibraryFileAdminMutation();
  const [removeFile, { isLoading: isRemoving }] = useRemoveLibraryFileAdminMutation();
  const [createAsset, { isLoading: isUploadingAsset }] = useCreateAssetAdminMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [overrideName, setOverrideName] = useState('');

  // ✅ IMPORTANT: "uploads" bucket backend'inde whitelist dışıysa 400 verir.
  // En güvenli default genelde "public".
  const [bucket, setBucket] = useState('public');
  // local hedefin için:
  const [folder, setFolder] = useState('uploads/catalog');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loading = isLoading || isFetching;
  const uploading = isUploadingAsset || isCreatingFile;

  const handleUpload = async () => {
    if (!libraryId) return;

    if (!selectedFile) {
      toast.error('Lütfen bir dosya seç.');
      return;
    }

    try {
      // 1) Upload (backend SHOULD return public url for local: /uploads/...)
      const storage = await createAsset({
        file: selectedFile,
        bucket,
        folder: folder || undefined,
        metadata: {
          // storage endpoint type: Record<string,string>
          module_key: 'library',
          library_id: libraryId,
          original_name: selectedFile.name,
          mime: selectedFile.type || 'application/octet-stream',
          locale: effectiveLocale, // (metadata içinde kalması zararsız; bazı backendlere faydalı)
        },
      } as any).unwrap();

      const storageId = norm((storage as any)?.id);
      const storageUrl = norm((storage as any)?.url);
      const storageMime =
        norm((storage as any)?.mime) || norm(selectedFile.type) || 'application/octet-stream';
      const storageSize = (storage as any)?.size;

      if (!storageId) throw new Error('Upload başarılı ama asset_id alınamadı.');
      if (!storageUrl) throw new Error('Upload başarılı ama public url alınamadı.');

      // 2) library_files row
      const displayName = overrideName.trim() || selectedFile.name;

      await createFile({
        id: libraryId,
        locale: effectiveLocale, // ✅ locale normalized
        payload: {
          asset_id: storageId,
          name: displayName,
          file_url: storageUrl,
          size_bytes: typeof storageSize === 'number' ? storageSize : null,
          mime_type: storageMime || null,
        },
      } as any).unwrap();

      toast.success('Dosya yüklendi ve kaydedildi.');

      setSelectedFile(null);
      setOverrideName('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      // non-blocking refetch
      void refetch();
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;

      if (status === 400) {
        toast.error(
          `Upload 400 (Bad Request). Bucket/Folder backend tarafından kabul edilmiyor olabilir. ` +
            `bucket="${bucket}", folder="${folder}". ` +
            `Detay: ${extractErrMsg(err)}`,
        );
        return;
      }

      toast.error(extractErrMsg(err));
    }
  };

  const handleRemove = async (file: LibraryFileDto) => {
    const fileId = norm((file as any)?.id);
    if (!libraryId || !fileId) return;

    const ok =
      typeof window !== 'undefined'
        ? window.confirm(`"${safeText((file as any).name)}" dosyasını silmek istiyor musun?`)
        : false;

    if (!ok) return;

    try {
      await removeFile({ id: libraryId, fileId, locale: effectiveLocale } as any).unwrap();
      toast.success('Dosya silindi.');
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;
      if (status === 404) toast.success('Dosya zaten silinmiş.');
      else toast.error(extractErrMsg(err));
    } finally {
      void refetch();
    }
  };

  const list = (files || []) as LibraryFileDto[];

  return (
    <div className="card h-100">
      <div className="card-header py-2">
        <div className="d-flex justify-content-between align-items-center">
          <span className="small fw-semibold">PDF / Dosyalar (library_files)</span>
          {loading && <span className="spinner-border spinner-border-sm" />}
        </div>
      </div>

      <div className="card-body">
        {list.length === 0 && !loading && (
          <div className="text-muted small mb-3">Henüz dosya eklenmemiş.</div>
        )}

        {list.length > 0 && (
          <ul className="list-group list-group-flush mb-3">
            {list.map((f) => {
              const href = norm((f as any)?.file_url);
              const label = safeText((f as any)?.name) || 'Dosya';

              return (
                <li
                  key={(f as any)?.id || `${label}-${href}`}
                  className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center small"
                >
                  <div className="me-2" style={{ minWidth: 0 }}>
                    <div className="fw-semibold text-truncate" title={label}>
                      {href ? (
                        <a href={href} target="_blank" rel="noreferrer">
                          {label}
                        </a>
                      ) : (
                        label
                      )}
                    </div>
                    <div
                      className="text-muted text-truncate"
                      title={safeText((f as any)?.mime_type)}
                    >
                      {(f as any)?.mime_type || 'mime yok'}
                      {typeof (f as any)?.size_bytes === 'number' && (f as any).size_bytes > 0 && (
                        <> • {(((f as any).size_bytes as number) / 1024).toFixed(1)} KB</>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    disabled={disabled || isRemoving}
                    onClick={() => handleRemove(f)}
                  >
                    Sil
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <hr className="my-2" />

        <div className="small">
          <div className="mb-2">
            <label className="form-label small mb-1">PDF / Dosya Seç</label>
            <input
              ref={fileInputRef}
              type="file"
              className="form-control form-control-sm"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              disabled={disabled || uploading}
            />
            <div className="form-text small">
              Dosya backend’e yüklenir. Lokal storage aktifse URL şu formatta olur:{' '}
              <code>https://www.ensotek.de/uploads/...</code>
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label small mb-1">Görünen Dosya Adı (name)</label>
            <input
              className="form-control form-control-sm"
              value={overrideName}
              onChange={(e) => setOverrideName(e.target.value)}
              disabled={disabled || uploading}
              placeholder="Boş bırakılırsa dosya adı kullanılır (örn: katalog.pdf)"
            />
          </div>

          <div className="row g-2 mb-2">
            <div className="col-6">
              <label className="form-label small mb-1">Bucket</label>
              <input
                className="form-control form-control-sm"
                value={bucket}
                onChange={(e) => setBucket(e.target.value)}
                disabled={disabled || uploading}
              />
              <div className="form-text small">
                Çoğu backend whitelist: <code>public</code> güvenli default.
              </div>
            </div>
            <div className="col-6">
              <label className="form-label small mb-1">Folder</label>
              <input
                className="form-control form-control-sm"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                disabled={disabled || uploading}
              />
              <div className="form-text small">
                Lokal için örn: <code>uploads/catalog</code> (backend kabulüne bağlı).
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            disabled={disabled || uploading}
            onClick={handleUpload}
          >
            {uploading ? 'Yükleniyor...' : 'Yükle ve Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
};
