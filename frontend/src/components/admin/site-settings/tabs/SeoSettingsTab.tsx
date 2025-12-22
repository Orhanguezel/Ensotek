// =============================================================
// FILE: src/components/admin/site-settings/tabs/SeoSettingsTab.tsx
// Ensotek – SEO Ayarları (localized only) + inline raw edit
//  - Header'da seçilen locale ne ise sadece o locale'in SEO kayıtları gösterilir.
//  - "Tüm SEO maddeleri" = seo, site_seo, site_meta_default (+ varsa diğer seo_* / seo|...)
// =============================================================

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
  useDeleteSiteSettingAdminMutation,
} from '@/integrations/rtk/hooks';

import type { SiteSetting, SettingValue } from '@/integrations/types/site_settings.types';

/* ----------------------------- helpers ----------------------------- */

function stringifyValuePretty(v: SettingValue): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function parseRawValue(raw: string): SettingValue {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as SettingValue;
  } catch {
    return trimmed;
  }
}

/**
 * ✅ DB standardına göre:
 *  - seo (primary)
 *  - site_seo (fallback)
 *  - site_meta_default (per-locale meta defaults)
 * Ayrıca projede mevcut olabilecek pattern’leri de kapsar.
 */
function isSeoKey(key: string): boolean {
  const k = String(key || '')
    .trim()
    .toLowerCase();
  if (!k) return false;

  return (
    k === 'seo' ||
    k === 'site_seo' ||
    k === 'site_meta_default' ||
    k.startsWith('seo_') ||
    k.startsWith('seo|') ||
    k.startsWith('site_seo|') ||
    k.startsWith('ui_seo') ||
    k.startsWith('ui_seo_')
  );
}

/**
 * ✅ "Tüm SEO maddeleri gelsin" isteği için:
 * Önce temel 3 key (seo, site_seo, site_meta_default), sonra kalan seo key’leri.
 */
const PRIMARY_SEO_KEYS = ['seo', 'site_seo', 'site_meta_default'] as const;

function orderSeoRows(rows: SiteSetting[]): SiteSetting[] {
  const map = new Map<string, SiteSetting>();
  for (const r of rows) map.set(r.key, r);

  const ordered: SiteSetting[] = [];

  for (const k of PRIMARY_SEO_KEYS) {
    const row = map.get(k);
    if (row) ordered.push(row);
  }

  // kalan SEO key’leri (primary olmayan)
  const rest = rows
    .filter((r) => !!r && isSeoKey(r.key) && !PRIMARY_SEO_KEYS.includes(r.key as any))
    .sort((a, b) => String(a.key).localeCompare(String(b.key)));

  return [...ordered, ...rest];
}

/* ----------------------------- component ----------------------------- */

export type SeoSettingsTabProps = {
  locale: string; // real locale (tr/en/de)
};

export const SeoSettingsTab: React.FC<SeoSettingsTabProps> = ({ locale }) => {
  const [search, setSearch] = useState('');

  // Raw edit modal
  const [editing, setEditing] = useState<SiteSetting | null>(null);
  const [editRaw, setEditRaw] = useState<string>('');

  // ✅ IMPORTANT:
  // Bu tab SADECE seçilen locale ile çalışır.
  // Diğer diller / global(*) içerik burada çekilmez.
  const listArgs = useMemo(() => {
    const q = search.trim() || undefined;
    return { locale, q };
  }, [locale, search]);

  const {
    data: rows,
    isLoading,
    isFetching,
    refetch,
  } = useListSiteSettingsAdminQuery(listArgs, {
    skip: !locale,
  });

  const seoRows = useMemo(() => {
    const arr = Array.isArray(rows) ? rows : [];
    const onlySeo = arr.filter((r) => r && isSeoKey(r.key));
    return orderSeoRows(onlySeo);
  }, [rows]);

  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();
  const [deleteSetting, { isLoading: isDeleting }] = useDeleteSiteSettingAdminMutation();

  const busy = isLoading || isFetching || isSaving || isDeleting;

  const handleEdit = (s: SiteSetting) => {
    setEditing(s);
    setEditRaw(stringifyValuePretty(s.value));
  };

  const handleClose = () => {
    setEditing(null);
    setEditRaw('');
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      const value = parseRawValue(editRaw);

      await updateSetting({
        key: editing.key,
        locale, // ✅ write to selected locale only
        value,
      }).unwrap();

      toast.success(`"${editing.key}" SEO ayarı güncellendi.`);
      handleClose();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'SEO ayarı güncellenirken hata oluştu.';
      toast.error(msg);
    }
  };

  const handleDelete = async (s: SiteSetting) => {
    const ok = window.confirm(`"${s.key}" (${locale}) silinsin mi?`);
    if (!ok) return;

    try {
      await deleteSetting({ key: s.key, locale }).unwrap();
      toast.success(`"${s.key}" silindi.`);
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'SEO ayarı silinirken hata oluştu.';
      toast.error(msg);
    }
  };

  const renderPreview = (v: SettingValue) => {
    const pretty = stringifyValuePretty(v);
    if (pretty.length <= 180) return pretty;
    return pretty.slice(0, 180) + '...';
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <span className="small fw-semibold">SEO Ayarları</span>
          <span className="text-muted small">
            Bu tab yalnızca seçili dilin SEO kayıtlarını gösterir (locale bazlı).
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border">Aktif dil: {locale}</span>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={refetch}
            disabled={busy}
          >
            Yenile
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="input-group input-group-sm mb-3">
          <span className="input-group-text">Ara</span>
          <input
            type="text"
            className="form-control"
            placeholder="Key veya değer içinde ara"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={busy}
          />
        </div>

        {busy && (
          <div className="mb-2">
            <span className="badge bg-secondary">Yükleniyor...</span>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Key</th>
                <th style={{ width: '45%' }}>Değer (Özet)</th>
                <th style={{ width: '20%' }} className="text-end">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {seoRows.length ? (
                seoRows.map((s) => (
                  <tr key={`${s.key}_${s.locale || 'none'}`}>
                    <td className="font-monospace small">{s.key}</td>
                    <td>
                      <span className="text-muted small">{renderPreview(s.value)}</span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleEdit(s)}
                          disabled={busy}
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(s)}
                          disabled={busy}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>
                    <div className="text-center text-muted small py-3">
                      SEO kaydı bulunamadı.
                      <div className="mt-1">
                        Not: Bu tab sadece <strong>{locale}</strong> localeini gösterir. Eğer{' '}
                        <code>seo</code> kaydın sadece <code>*</code> ise, burada görünmez; o
                        locale’de override kaydı oluşturmalısın.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --------------------- Raw Edit Modal --------------------- */}
      {editing && (
        <>
          <div className="modal-backdrop fade show" />

          <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h5 className="modal-title small mb-0">
                    SEO Düzenle: <code>{editing.key}</code>
                    <span className="badge bg-light text-dark border ms-2">{locale}</span>
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Kapat"
                    onClick={handleClose}
                    disabled={isSaving}
                  />
                </div>

                <div className="modal-body">
                  <p className="text-muted small mb-2">
                    Geçerli JSON girersen değer JSON olarak, aksi halde düz string olarak saklanır.
                  </p>

                  <label className="form-label small">Değer (raw / JSON)</label>
                  <textarea
                    className="form-control font-monospace"
                    rows={10}
                    value={editRaw}
                    onChange={(e) => setEditRaw(e.target.value)}
                    spellCheck={false}
                  />
                </div>

                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleClose}
                    disabled={isSaving}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
