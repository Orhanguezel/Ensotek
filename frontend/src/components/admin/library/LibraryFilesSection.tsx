// =============================================================
// FILE: src/components/admin/library/LibraryFilesSection.tsx
// Ensotek – Admin Library Files Section (Storage entegre) [FINAL FIX]
// FIX:
// - PDF Cloudinary URL sometimes returns /image/upload/.../*.pdf
//   => normalize to /raw/upload/.../*.pdf before saving to DB
// - Keeps current RTK hooks + refetch behavior
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
  disabled: boolean;
};

const safeText = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const norm = (v: unknown) => String(v ?? '').trim();

const isPdfLike = (nameOrUrl: string, mime?: string) => {
  const m = norm(mime).toLowerCase();
  if (m === 'application/pdf') return true;

  const s = norm(nameOrUrl).toLowerCase();
  const base = s.split('?')[0].split('#')[0];
  return base.endsWith('.pdf');
};

/**
 * Cloudinary PDF fix:
 * if cloudinary url ends with .pdf and contains /image/upload/ => /raw/upload/
 */
const normalizeCloudinaryPdfUrl = (urlRaw: string): string => {
  const url = norm(urlRaw);
  if (!url) return '';

  const lower = url.toLowerCase();
  if (!lower.includes('res.cloudinary.com')) return url;

  const base = lower.split('?')[0].split('#')[0];
  if (!base.endsWith('.pdf')) return url;

  if (lower.includes('/raw/upload/')) return url;

  if (lower.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/raw/upload/');
  }

  return url;
};

export const LibraryFilesSection: React.FC<LibraryFilesSectionProps> = ({
  libraryId,
  disabled,
}) => {
  const {
    data: files,
    isLoading,
    isFetching,
    refetch,
  } = useListLibraryFilesAdminQuery({ id: libraryId }, { skip: !libraryId });

  const [createFile, { isLoading: isCreatingFile }] = useCreateLibraryFileAdminMutation();
  const [removeFile, { isLoading: isRemoving }] = useRemoveLibraryFileAdminMutation();
  const [createAsset, { isLoading: isUploadingAsset }] = useCreateAssetAdminMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [overrideName, setOverrideName] = useState('');
  const [bucket, setBucket] = useState('public');
  const [folder, setFolder] = useState(`library/${libraryId}`);

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
      // 1) Storage'a upload
      const storage = await createAsset({
        file: selectedFile,
        bucket,
        folder: folder || undefined,
        metadata: {
          module_key: 'library',
          library_id: libraryId,
          original_name: selectedFile.name,
          mime: selectedFile.type || 'application/octet-stream',
        },
      } as any).unwrap();

      const storageId = norm((storage as any)?.id);
      const storageUrlRaw = norm((storage as any)?.url);
      const storageMime = norm((storage as any)?.mime) || norm(selectedFile.type);
      const storageSize = (storage as any)?.size;

      if (!storageId) {
        throw new Error('Upload başarılı ama asset_id alınamadı.');
      }

      // 2) library_files kaydı
      const displayName = overrideName.trim() || selectedFile.name;

      // ✅ FIX: PDF ise Cloudinary raw url’ye normalize et
      const urlFixed =
        isPdfLike(displayName || storageUrlRaw, storageMime) && storageUrlRaw
          ? normalizeCloudinaryPdfUrl(storageUrlRaw)
          : storageUrlRaw;

      await createFile({
        id: libraryId,
        payload: {
          asset_id: storageId,
          name: displayName,
          file_url: urlFixed || null,
          size_bytes: typeof storageSize === 'number' ? storageSize : null,
          mime_type: storageMime || null,
        },
      } as any).unwrap();

      toast.success('Dosya yüklendi ve kaydedildi.');

      // state reset
      setSelectedFile(null);
      setOverrideName('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        'Dosya yüklenirken veya library_files kaydedilirken hata oluştu.';
      toast.error(msg);
    }
  };

  const handleRemove = async (file: LibraryFileDto) => {
    if (!libraryId || !(file as any).id) return;
    if (!confirm(`"${safeText((file as any).name)}" dosyasını silmek istiyor musun?`)) return;

    try {
      await removeFile({ id: libraryId, fileId: (file as any).id } as any).unwrap();
      toast.success('Dosya silindi.');
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'Dosya silinirken hata oluştu.';
      toast.error(msg);
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
        {/* Liste */}
        {(!files || (files as any[]).length === 0) && !loading && (
          <div className="text-muted small mb-3">Henüz dosya eklenmemiş.</div>
        )}

        {files && (files as any[]).length > 0 && (
          <ul className="list-group list-group-flush mb-3">
            {(files as any[]).map((f: any) => {
              const href = norm(f?.file_url); // ✅ DTO: file_url
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

        {/* Upload alanı */}
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
              Dosya önce Storage modülüne yüklenir, ardından <code>library_files</code> tablosuna{' '}
              <code>asset_id</code> ile kaydedilir. PDF ise URL otomatik olarak{' '}
              <code>/raw/upload</code> formatına normalize edilir.
            </div>
          </div>

          <div className="mb-2">
            <label className="form-label small mb-1">Görünen Dosya Adı (name)</label>
            <input
              className="form-control form-control-sm"
              value={overrideName}
              onChange={(e) => setOverrideName(e.target.value)}
              disabled={disabled || uploading}
              placeholder="Boş bırakılırsa dosya adı kullanılır (örn: brosur.pdf)"
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
                Örn: <code>public</code>
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
                Örn: <code>library/{libraryId}</code>
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
