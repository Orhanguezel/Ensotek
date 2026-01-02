// =============================================================
// FILE: src/components/admin/library/LibraryFilesSection.tsx
// Ensotek – Admin Library Files Section [FINAL - LOCAL FIRST]
// FIX (MINIMAL):
// - Send locale to list/create/delete (x-locale header RTK tarafında var)
// - Default bucket "uploads" caused 400 on /admin/storage/assets (backend likely whitelists buckets)
//   => default bucket set to "public" (works with most setups)
// - Keep local-first expectation: folder default "uploads/catalog" (adjust if backend expects "catalog")
// - Delete: treat 404 as success (idempotent), always refetch
// =============================================================

'use client';

import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

import type { LibraryFileDto } from '@/integrations/types/library.types';

import {
  useListLibraryFilesAdminQuery,
  useCreateLibraryFileAdminMutation,
  useRemoveLibraryFileAdminMutation,
  useCreateAssetAdminMutation,
} from '@/integrations/rtk/hooks';

export type LibraryFilesSectionProps = {
  libraryId: string;
  locale?: string; // ✅ locale support
  disabled: boolean;
};

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const norm = (v: unknown) => String(v ?? '').trim();

function extractErrMsg(err: any): string {
  // RTK FetchBaseQueryError şekilleri
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
  disabled,
}) => {
  const {
    data: files,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryFilesAdminQuery(
    { id: libraryId, locale }, // ✅ locale
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
        },
      } as any).unwrap();

      const storageId = norm((storage as any)?.id);
      const storageUrl = norm((storage as any)?.url); // expected: https://www.ensotek.de/uploads/...
      const storageMime = norm((storage as any)?.mime) || norm(selectedFile.type);
      const storageSize = (storage as any)?.size;

      if (!storageId) throw new Error('Upload başarılı ama asset_id alınamadı.');
      if (!storageUrl) throw new Error('Upload başarılı ama public url alınamadı.');

      // 2) library_files row
      const displayName = overrideName.trim() || selectedFile.name;

      await createFile({
        id: libraryId,
        locale, // ✅ locale
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

      await refetch();
    } catch (err: any) {
      const status = err?.status ?? err?.originalStatus;

      // 400 ise çoğunlukla bucket/folder validasyonu
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

    if (!confirm(`"${safeText((file as any).name)}" dosyasını silmek istiyor musun?`)) return;

    try {
      await removeFile({ id: libraryId, fileId, locale } as any).unwrap(); // ✅ locale
      toast.success('Dosya silindi.');
    } catch (err: any) {
      // ✅ idempotent delete: "not found" => ok
      const status = err?.status ?? err?.originalStatus;
      if (status === 404) toast.success('Dosya zaten silinmiş.');
      else toast.error(extractErrMsg(err));
    } finally {
      await refetch();
    }
  };

  return (
    <div className="card h-100">
      <div className="card-header py-2">
        <div className="d-flex justify-content-between align-items-center">
          <span className="small fw-semibold">PDF / Dosyalar (library_files)</span>
          {loading && <span className="spinner-border spinner-border-sm" />}
        </div>
      </div>

      <div className="card-body">
        {(!files || (files as any[]).length === 0) && !loading && (
          <div className="text-muted small mb-3">Henüz dosya eklenmemiş.</div>
        )}

        {files && (files as any[]).length > 0 && (
          <ul className="list-group list-group-flush mb-3">
            {(files as any[]).map((f: any) => {
              const href = norm(f?.file_url);
              const label = safeText(f?.name) || 'Dosya';

              return (
                <li
                  key={f?.id || `${label}-${href}`}
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
                    <div className="text-muted text-truncate" title={safeText(f?.mime_type)}>
                      {f?.mime_type || 'mime yok'}
                      {typeof f?.size_bytes === 'number' && f.size_bytes > 0 && (
                        <> • {(f.size_bytes / 1024).toFixed(1)} KB</>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    disabled={disabled || isRemoving}
                    onClick={() => handleRemove(f as any)}
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
