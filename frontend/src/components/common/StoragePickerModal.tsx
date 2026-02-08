// =============================================================
// FILE: src/components/common/StoragePickerModal.tsx
// Storage Media Library Picker Modal
// - Lists all storage assets with filtering
// - Supports single and multiple selection
// - Search, folder filter, pagination
// =============================================================

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useListAssetsAdminQuery } from '@/integrations/rtk/hooks';

export type StoragePickerModalProps = {
  show: boolean;
  onHide: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  selectedUrls?: string[];
  bucket?: string;
  folder?: string;
};

const norm = (v: unknown) => String(v ?? '').trim();

const isSvgUrl = (url: string): boolean => {
  const lower = url.toLowerCase();
  return lower.endsWith('.svg') || lower.includes('format=svg') || lower.includes('f_svg');
};

export const StoragePickerModal: React.FC<StoragePickerModalProps> = ({
  show,
  onHide,
  onSelect,
  multiple = false,
  selectedUrls = [],
  bucket = 'public',
  folder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(folder || '');
  const [localSelection, setLocalSelection] = useState<string[]>(selectedUrls);

  // Fetch assets
  const { data, isLoading, error } = useListAssetsAdminQuery(
    {
      bucket,
      folder: selectedFolder || undefined,
      q: searchQuery || undefined,
      limit: 100,
    },
    { skip: !show },
  );

  const assets = data?.items || [];
  const total = data?.total || 0;

  // Extract unique folders from assets
  const folders = useMemo(() => {
    const folderSet = new Set<string>();
    assets.forEach((asset) => {
      if (asset.folder) folderSet.add(asset.folder);
    });
    return Array.from(folderSet).sort();
  }, [assets]);

  const handleSelectAsset = (url: string) => {
    if (!multiple) {
      setLocalSelection([url]);
      return;
    }

    setLocalSelection((prev) => {
      const exists = prev.includes(url);
      if (exists) {
        return prev.filter((u) => u !== url);
      }
      return [...prev, url];
    });
  };

  const handleConfirm = () => {
    if (localSelection.length === 0) {
      toast.error('Lütfen en az bir görsel seçin.');
      return;
    }

    onSelect(localSelection);
    onHide();
  };

  const handleCancel = () => {
    setLocalSelection(selectedUrls);
    onHide();
  };

  const isSelected = (url: string) => localSelection.includes(url);

  // Bootstrap modal control
  useEffect(() => {
    if (show) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={handleCancel}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: 'block', zIndex: 1050 }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Medya Kütüphanesi</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCancel}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Filters */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ara (dosya adı, URL...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                  >
                    <option value="">Tüm Klasörler</option>
                    {folders.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="text-muted small">
                  {isLoading ? (
                    'Yükleniyor...'
                  ) : error ? (
                    <span className="text-danger">Hata oluştu</span>
                  ) : (
                    <>
                      {total} görsel bulundu
                      {localSelection.length > 0 && ` · ${localSelection.length} seçili`}
                    </>
                  )}
                </div>

                {localSelection.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setLocalSelection([])}
                  >
                    Seçimi Temizle
                  </button>
                )}
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">Görseller yüklenirken hata oluştu.</div>
              ) : assets.length === 0 ? (
                <div className="alert alert-info">
                  Görsel bulunamadı. {searchQuery && 'Farklı bir arama deneyin.'}
                </div>
              ) : (
                <div className="row g-3">
                  {assets.map((asset) => {
                    const url = norm(asset.url);
                    const selected = isSelected(url);
                    const isSvg = isSvgUrl(url);

                    return (
                      <div key={asset.id} className="col-6 col-md-4 col-lg-3">
                        <div
                          className={`card h-100 cursor-pointer ${selected ? 'border-primary border-2' : ''}`}
                          onClick={() => handleSelectAsset(url)}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Image Preview */}
                          <div
                            className="position-relative bg-light"
                            style={{ paddingTop: '75%', overflow: 'hidden' }}
                          >
                            {isSvg ? (
                              <object
                                data={url}
                                type="image/svg+xml"
                                className="position-absolute top-0 start-0 w-100 h-100"
                                aria-label={asset.name}
                                style={{ pointerEvents: 'none' }}
                              >
                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                                  <span className="text-muted small">SVG</span>
                                </div>
                              </object>
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={url}
                                alt={asset.name}
                                className="position-absolute top-0 start-0 w-100 h-100"
                                style={{ objectFit: 'cover', pointerEvents: 'none' }}
                                loading="lazy"
                              />
                            )}

                            {/* Selected Badge */}
                            {selected && (
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className="badge bg-primary">
                                  ✓ Seçili
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Card Body */}
                          <div className="card-body p-2">
                            <div
                              className="small fw-medium text-truncate"
                              title={asset.name}
                              style={{ fontSize: '0.8rem' }}
                            >
                              {asset.name}
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                              {asset.width && asset.height && (
                                <span>
                                  {asset.width}×{asset.height}
                                </span>
                              )}
                              {asset.size && (
                                <span className="ms-2">
                                  {(asset.size / 1024).toFixed(1)} KB
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                İptal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirm}
                disabled={localSelection.length === 0}
              >
                {multiple ? `Seç (${localSelection.length})` : 'Seç'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
