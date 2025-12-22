// =============================================================
// FILE: src/components/admin/site-settings/tabs/GeneralSettingsTab.tsx
// Ensotek – Genel / UI Ayarları (localized only) + inline raw edit
//  - Header'da seçilen locale ne ise sadece o locale'in kayıtları gösterilir.
//  - Keys: contact_info, socials, businessHours, company_profile, ui_header
// =============================================================

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  useListSiteSettingsAdminQuery,
  useUpdateSiteSettingAdminMutation,
  useDeleteSiteSettingAdminMutation,
} from '@/integrations/rtk/hooks';

import type { SiteSetting, SettingValue } from '@/integrations/types/site_settings.types';

/* ----------------------------- config ----------------------------- */

const GENERAL_KEYS = [
  'contact_info',
  'socials',
  'businessHours',
  'company_profile',
  'ui_header',
] as const;

type GeneralKey = (typeof GENERAL_KEYS)[number];

const ROWS_HINT: Record<GeneralKey, number> = {
  contact_info: 8,
  socials: 6,
  businessHours: 8,
  company_profile: 8,
  ui_header: 10,
};

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

function formatValuePreview(v: SettingValue): string {
  const s = stringifyValuePretty(v);
  if (s.length <= 140) return s;
  return s.slice(0, 140) + '...';
}

function sortByGeneralKeyOrder(rows: SiteSetting[]): SiteSetting[] {
  const order = new Map<string, number>(GENERAL_KEYS.map((k, i) => [k, i]));
  return [...rows].sort((a, b) => {
    const ai = order.get(a.key) ?? 999;
    const bi = order.get(b.key) ?? 999;
    if (ai !== bi) return ai - bi;
    return String(a.key).localeCompare(String(b.key));
  });
}

/* ----------------------------- component ----------------------------- */

export type GeneralSettingsTabProps = {
  locale: string; // real locale (tr/en/de)
};

export const GeneralSettingsTab: React.FC<GeneralSettingsTabProps> = ({ locale }) => {
  const [search, setSearch] = useState('');

  // Raw edit modal
  const [editing, setEditing] = useState<SiteSetting | null>(null);
  const [editRaw, setEditRaw] = useState<string>('');

  // ✅ Only selected locale
  const listArgs = useMemo(() => {
    const q = search.trim() || undefined;
    return { locale, q, keys: GENERAL_KEYS as unknown as string[] };
  }, [locale, search]);

  const {
    data: rows,
    isLoading,
    isFetching,
    refetch,
  } = useListSiteSettingsAdminQuery(listArgs, {
    skip: !locale,
  });

  const generalRows = useMemo(() => {
    const arr = Array.isArray(rows) ? rows : [];

    // keys param backende gitse bile, client-side garanti için tekrar filtreliyoruz
    const onlyGeneral = arr.filter((r) => r && GENERAL_KEYS.includes(r.key as GeneralKey));
    return sortByGeneralKeyOrder(onlyGeneral);
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

      toast.success(`"${editing.key}" güncellendi.`);
      handleClose();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Genel / UI ayarı güncellenirken hata oluştu.';
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
      const msg =
        err?.data?.error?.message || err?.message || 'Genel / UI ayarı silinirken hata oluştu.';
      toast.error(msg);
    }
  };

  return (
    <div className="card">
      <div className="card-header py-2 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column">
          <span className="small fw-semibold">Genel / UI</span>
          <span className="text-muted small">
            Bu tab yalnızca seçili dilin (locale bazlı) genel/UI anahtarlarını gösterir.
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
              {generalRows.length ? (
                generalRows.map((s) => (
                  <tr key={`${s.key}_${s.locale || 'none'}`}>
                    <td className="font-monospace small">{s.key}</td>
                    <td>
                      <span className="text-muted small">{formatValuePreview(s.value)}</span>
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
                      Kayıt bulunamadı.
                      <div className="mt-1">
                        Not: Bu tab sadece <strong>{locale}</strong> localeini gösterir. İlgili key
                        bu locale’de yoksa görünmez.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <caption className="pt-2">
              <span className="text-muted small">
                Gösterilen anahtarlar:{' '}
                {GENERAL_KEYS.map((k) => (
                  <code key={k} className="ms-1">
                    {k}
                  </code>
                ))}
              </span>
            </caption>
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
                    Düzenle: <code>{editing.key}</code>
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
                    rows={ROWS_HINT[(editing.key as GeneralKey) ?? 'contact_info'] ?? 10}
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
