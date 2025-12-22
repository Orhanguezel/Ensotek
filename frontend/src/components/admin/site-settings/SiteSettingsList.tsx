// =============================================================
// FILE: src/components/admin/site-settings/SiteSettingsList.tsx
// Ensotek – Site Ayarları Liste Bileşeni
// FIXED: Hide SEO keys in global(*) list.
// UI FIX: Mobile responsive cards (stack actions, prevent overflow)
// =============================================================

import React, { useMemo } from 'react';
import type { SiteSetting, SettingValue } from '@/integrations/types/site_settings.types';

function formatValuePreview(v: SettingValue): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') {
    if (v.length <= 160) return v;
    return v.slice(0, 157) + '...';
  }
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);

  try {
    const s = JSON.stringify(v);
    if (s.length <= 160) return s;
    return s.slice(0, 157) + '...';
  } catch {
    return String(v as any);
  }
}

function isSeoKey(key: string): boolean {
  const k = String(key || '')
    .trim()
    .toLowerCase();
  if (!k) return false;

  return (
    k.startsWith('seo_') ||
    k.startsWith('seo|') ||
    k === 'site_seo' ||
    k.startsWith('site_seo|') ||
    k.startsWith('ui_seo') ||
    k.startsWith('ui_seo_')
  );
}

export type SiteSettingsListProps = {
  settings?: SiteSetting[];
  loading: boolean;
  onEdit?: (setting: SiteSetting) => void;
  onDelete?: (setting: SiteSetting) => void;
  selectedLocale: string; // 'en' | 'tr' | '*'
};

export const SiteSettingsList: React.FC<SiteSettingsListProps> = ({
  settings,
  loading,
  onEdit,
  onDelete,
  selectedLocale,
}) => {
  const filtered = useMemo(() => {
    const arr = Array.isArray(settings) ? settings : [];

    // ✅ Global(*) list: SEO keys shown in SEO tab, so hide here
    if (selectedLocale === '*') {
      return arr.filter((s) => s && !isSeoKey(s.key));
    }

    return arr;
  }, [settings, selectedLocale]);

  const hasData = filtered.length > 0;

  return (
    <div className="card">
      <div className="card-header py-2 d-flex align-items-center justify-content-between">
        <span className="small fw-semibold">
          Ayar Listesi{' '}
          {selectedLocale ? (
            <span className="badge bg-light text-dark border ms-2">{selectedLocale}</span>
          ) : null}
        </span>
        {loading && <span className="badge bg-secondary">Yükleniyor...</span>}
      </div>

      <div className="card-body p-0">
        {/* ===================== DESKTOP TABLE (md+) ===================== */}
        <div className="d-none d-md-block">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Key</th>
                <th style={{ width: '10%' }}>Locale</th>
                <th style={{ width: '35%' }}>Değer (Özet)</th>
                <th style={{ width: '15%' }}>Güncellenme</th>
                <th style={{ width: '10%' }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>

            <tbody>
              {hasData ? (
                filtered.map((s) => (
                  <tr key={`${s.key}_${s.locale || 'none'}`} style={{ cursor: 'default' }}>
                    <td style={{ wordBreak: 'break-word' }}>{s.key}</td>
                    <td>{s.locale || <span className="text-muted">-</span>}</td>
                    <td>
                      <span className="text-muted small" style={{ wordBreak: 'break-word' }}>
                        {formatValuePreview(s.value)}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted small">
                        {s.updated_at ? new Date(s.updated_at).toLocaleString() : '-'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        {onEdit && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => onEdit(s)}
                          >
                            Düzenle
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => onDelete(s)}
                          >
                            Sil
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center text-muted small py-3">Kayıt bulunamadı.</div>
                  </td>
                </tr>
              )}
            </tbody>

            <caption className="px-3 py-2 text-start">
              <span className="text-muted small">
                Bu tablo <code>site_settings</code> kayıtlarını <strong>{selectedLocale}</strong>{' '}
                locale’i için gösterir.
                {selectedLocale === '*' ? (
                  <> SEO anahtarları bu listede gizlenir; SEO tab’ında yönetilir.</>
                ) : null}
              </span>
            </caption>
          </table>
        </div>

        {/* ===================== MOBILE CARDS (sm and down) ===================== */}
        <div className="d-block d-md-none">
          {hasData ? (
            filtered.map((s) => {
              const localeBadge = s.locale ? (
                <span className="badge bg-light text-dark border ms-2">{s.locale}</span>
              ) : null;

              return (
                <div key={`${s.key}_${s.locale || 'none'}`} className="border-bottom px-3 py-3">
                  {/* Key + locale */}
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <div style={{ minWidth: 0 }}>
                      <div className="fw-semibold small" style={{ wordBreak: 'break-word' }}>
                        {s.key}
                        {localeBadge}
                      </div>

                      {/* Value preview */}
                      <div
                        className="text-muted small mt-1"
                        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                      >
                        {formatValuePreview(s.value)}
                      </div>

                      {/* Updated */}
                      <div className="text-muted small mt-2">
                        <span className="me-1">Güncellenme:</span>
                        {s.updated_at ? new Date(s.updated_at).toLocaleString() : '-'}
                      </div>
                    </div>
                  </div>

                  {/* Actions: stack, full width */}
                  {(onEdit || onDelete) && (
                    <div className="mt-3 d-flex flex-column gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm w-100"
                          onClick={() => onEdit(s)}
                        >
                          Düzenle
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm w-100"
                          onClick={() => onDelete(s)}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-3 text-center text-muted small">Kayıt bulunamadı.</div>
          )}

          <div className="px-3 py-2 border-top">
            <span className="text-muted small">
              Mobil görünümde kayıtlar kart formatında listelenir.
              {selectedLocale === '*' ? ' SEO anahtarları burada da gizlidir.' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
