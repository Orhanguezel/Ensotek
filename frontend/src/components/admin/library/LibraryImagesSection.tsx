'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { AdminImageUploadField } from '@/components/common/AdminImageUploadField';

import type {
  LibraryImageDto,
  LibraryImageCreatePayload,
  LibraryImageUpdatePayload,
} from '@/integrations/types/library.types';

import {
  useListLibraryImagesAdminQuery,
  useCreateLibraryImageAdminMutation,
  useUpdateLibraryImageAdminMutation,
  useRemoveLibraryImageAdminMutation,
} from '@/integrations/rtk/hooks';

export type LibraryImagesSectionProps = {
  libraryId: string;
  locale: string;
  disabled?: boolean;
  onSelectAsCover?: (url: string) => void;
  coverUrl?: string;
  metadata?: Record<string, string | number | boolean>;
};

const toStr = (v: unknown) => (v === null || v === undefined ? '' : String(v));

function normalizeRows(data: any): LibraryImageDto[] {
  if (Array.isArray(data)) return data as LibraryImageDto[];
  if (Array.isArray(data?.items)) return data.items as LibraryImageDto[];
  if (Array.isArray(data?.data)) return data.data as LibraryImageDto[];
  if (Array.isArray(data?.rows)) return data.rows as LibraryImageDto[];
  return [];
}

function orderOf(r: any): number {
  const n = Number(r?.display_order);
  return Number.isFinite(n) ? n : 0;
}

/** “id” alanı bazı response’larda farklı isimle gelebilir. Güvenli tek yerden çöz. */
function imageIdOf(r: any): string {
  const v = r?.id ?? r?.image_id ?? r?.imageId ?? r?.imageID;
  return v ? String(v) : '';
}

const UrlInline: React.FC<{ url: string; disabled?: boolean }> = ({ url, disabled }) => {
  const safe = (url || '').trim();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!safe) return;

    try {
      await navigator.clipboard.writeText(safe);
      toast.success('URL kopyalandı.');
    } catch {
      toast.error('URL kopyalanamadı.');
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <div
        className="text-muted small"
        title={safe}
        style={{
          minWidth: 0,
          flex: '1 1 auto',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {safe}
      </div>

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={handleCopy}
        disabled={disabled || !safe}
        title="Tam URL’i kopyala"
        style={{ flex: '0 0 auto' }}
      >
        Kopyala
      </button>
    </div>
  );
};

export const LibraryImagesSection: React.FC<LibraryImagesSectionProps> = ({
  libraryId,
  locale,
  disabled,
  onSelectAsCover,
  coverUrl,
  metadata,
}) => {
  const { data, isLoading, isFetching, refetch } = useListLibraryImagesAdminQuery(
    { id: libraryId, locale } as any,
    { skip: !libraryId },
  );

  const [createImg, { isLoading: creating }] = useCreateLibraryImageAdminMutation();
  const [updateImg, { isLoading: updating }] = useUpdateLibraryImageAdminMutation();
  const [removeImg, { isLoading: deleting }] = useRemoveLibraryImageAdminMutation();

  const busy = !!disabled || creating || updating || deleting;

  const rows: LibraryImageDto[] = useMemo(() => normalizeRows(data), [data]);

  const inflightUrlsRef = useRef<Set<string>>(new Set());
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string>('');

  const sortedRows = useMemo(() => {
    return rows
      .slice()
      .sort(
        (a: any, b: any) => orderOf(a) - orderOf(b) || String(a.id).localeCompare(String(b.id)),
      );
  }, [rows]);

  const getNextOrder = () => {
    const maxOrder = rows.reduce((m, r: any) => Math.max(m, orderOf(r)), 0);
    return maxOrder + 10;
  };

  const createLibraryImageFromUrl = async (url: string) => {
    const safeUrl = url.trim();
    if (!safeUrl) return;

    const exists = rows.some((r: any) => (r.image_url || '').trim() === safeUrl);
    if (exists) return;

    if (inflightUrlsRef.current.has(safeUrl)) return;
    inflightUrlsRef.current.add(safeUrl);

    try {
      const payload: LibraryImageCreatePayload = {
        image_url: safeUrl,
        image_asset_id: null,

        // UI'de pasif yok; yeni eklenen her görsel aktif kabul
        is_active: true,

        display_order: getNextOrder(),

        locale,
        title: null,
        alt: null,
        caption: null,
      };

      await createImg({ id: libraryId, payload } as any).unwrap();
      toast.success('Galeri görseli eklendi.');
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'Resim kaydı oluşturulamadı.';
      toast.error(msg);
    } finally {
      inflightUrlsRef.current.delete(safeUrl);
    }
  };

  const handleUploadedUrl = async (url: string) => {
    setLastUploadedUrl(url);
    await createLibraryImageFromUrl(url);
  };

  const handleSetOrder = useCallback(
    async (r: LibraryImageDto, display_order: number) => {
      const imageId = imageIdOf(r);
      if (!imageId) {
        toast.error('imageId bulunamadı (response alanlarını kontrol et).');
        return;
      }

      try {
        const patch: LibraryImageUpdatePayload = { display_order, locale };
        await updateImg({ id: libraryId, imageId, patch } as any).unwrap();
        toast.success('Sıralama güncellendi.');
        await refetch();
      } catch (err: any) {
        const msg = err?.data?.error?.message || err?.message || 'Sıralama güncellenemedi.';
        toast.error(msg);
      }
    },
    [libraryId, locale, updateImg, refetch],
  );

  const handleDelete = useCallback(
    async (r: LibraryImageDto, e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();

      const imageId = imageIdOf(r);
      if (!imageId) {
        toast.error('imageId bulunamadı (response alanlarını kontrol et).');
        return;
      }

      if (!confirm('Bu görseli silmek istiyor musun?')) return;

      try {
        await removeImg({ id: libraryId, imageId } as any).unwrap();
        toast.success('Görsel silindi.');
        await refetch();
      } catch (err: any) {
        const status = err?.status ?? err?.originalStatus;
        if (status === 404) {
          // 404: genelde “zaten silinmiş / id bulunamadı”
          toast.error('Görsel bulunamadı (404). Listeyi yeniliyorum.');
          await refetch();
          return;
        }

        const msg = err?.data?.error?.message || err?.message || 'Silme hatası.';
        toast.error(msg);
      }
    },
    [libraryId, removeImg, refetch],
  );

  return (
    <div className="card">
      <div className="card-body small">
        <div className="fw-semibold mb-2 d-flex justify-content-between align-items-center">
          <span>Galeri Görselleri</span>
          {(isLoading || isFetching) && <span className="badge bg-secondary">Yükleniyor...</span>}
        </div>

        <AdminImageUploadField
          label="Yeni görseller yükle"
          helperText={
            <>
              Storage&apos;a yükler ve her yüklemede oluşan URL ile <code>library_images</code>{' '}
              tablosuna kayıt açar. “Kapak” seçimi <code>library.image_url</code> alanını günceller.
            </>
          }
          bucket="public"
          folder="library/gallery"
          metadata={metadata}
          multiple
          value={lastUploadedUrl}
          onChange={handleUploadedUrl}
          disabled={busy}
          openLibraryHref="/admin/storage"
        />

        <hr className="my-3" />

        {sortedRows.length === 0 ? (
          <div className="text-muted">Bu kayıt için galeri görseli yok.</div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {sortedRows.map((r: any) => {
              const id = imageIdOf(r);
              const url = (r.image_url || '').trim();
              const isCover = !!coverUrl && coverUrl === url;

              return (
                <div
                  key={id || String(url)}
                  className={`border rounded-2 p-2 ${isCover ? 'border-primary' : ''}`}
                >
                  <div className="d-flex gap-2 align-items-start">
                    <div style={{ width: 180, flex: '0 0 auto' }}>
                      <div className="ratio ratio-16x9 bg-white border rounded overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={toStr(r.alt)}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div style={{ minWidth: 0 }}>
                          <div className="fw-semibold small d-flex align-items-center gap-2">
                            <span>#{orderOf(r)}</span>
                          </div>

                          <UrlInline url={url} disabled={busy} />
                        </div>

                        <div className="d-flex gap-1 flex-wrap justify-content-end">
                          {onSelectAsCover && url && (
                            <button
                              type="button"
                              className={`btn btn-sm ${
                                isCover ? 'btn-primary' : 'btn-outline-primary'
                              }`}
                              disabled={busy}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSelectAsCover(url);
                              }}
                            >
                              Kapak
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            disabled={busy}
                            onClick={(e) => handleDelete(r, e)}
                          >
                            Sil
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 d-flex align-items-center gap-2">
                        <label className="small text-muted mb-0">Sıra</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ maxWidth: 120 }}
                          disabled={busy}
                          defaultValue={orderOf(r)}
                          onBlur={(e) => handleSetOrder(r, Number(e.target.value) || 0)}
                        />
                        <div className="small text-muted">display_order</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sortedRows.length === 0 && data && !Array.isArray(data) && (
          <div className="form-text small mt-2">
            Liste yanıtı array değil. Response keys:{' '}
            <code>{Object.keys(data || {}).join(', ')}</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryImagesSection;
