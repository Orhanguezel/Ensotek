// =============================================================
// FILE: src/pages/admin/site-settings/index.tsx
// =============================================================

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  useListSiteSettingsAdminQuery,
  useDeleteSiteSettingAdminMutation,
  useUpdateSiteSettingAdminMutation,
  useGetAppLocalesAdminQuery,
  useGetDefaultLocaleAdminQuery,
} from '@/integrations/rtk/hooks';

import {
  SiteSettingsHeader,
  type SettingsTab,
  type LocaleOption,
} from '@/components/admin/site-settings/SiteSettingsHeader';

import { SiteSettingsList } from '@/components/admin/site-settings/SiteSettingsList';

import {
  GeneralSettingsTab,
  SeoSettingsTab,
  SmtpSettingsTab,
  CloudinarySettingsTab,
  ApiSettingsTab,
  FooterSettingsTab,
} from '@/components/admin/site-settings/tabs';

import type {
  SettingValue,
  AppLocaleItem,
  SiteSetting,
} from '@/integrations/types/site_settings.types';

type SettingsScope = 'localized' | 'global' | 'mixed';

const TAB_SCOPE: Record<SettingsTab, SettingsScope> = {
  list: 'mixed',
  global_list: 'global', // ✅ NEW
  general: 'localized',
  seo: 'localized',
  smtp: 'global',
  cloudinary: 'global',
  api: 'global',
  footer: 'localized',
};

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

const toShortLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

function uniqByCode(items: AppLocaleItem[]): AppLocaleItem[] {
  const seen = new Set<string>();
  const out: AppLocaleItem[] = [];
  for (const it of items) {
    const code = toShortLocale(it?.code);
    if (!code) continue;
    if (seen.has(code)) continue;
    seen.add(code);
    out.push({ ...it, code });
  }
  return out;
}

function buildLocaleLabel(item: AppLocaleItem): string {
  const code = toShortLocale(item.code);
  const label = String(item.label || '').trim();
  return label ? `${label} (${code})` : code.toUpperCase();
}

const SiteSettingsAdminPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<SettingsTab>('list');
  const [selectedLocale, setSelectedLocale] = useState<string>('');

  const [editing, setEditing] = useState<SiteSetting | null>(null);
  const [editRaw, setEditRaw] = useState<string>('');

  const {
    data: appLocalesItems,
    isLoading: isLocalesLoading,
    isFetching: isLocalesFetching,
  } = useGetAppLocalesAdminQuery();

  const {
    data: defaultLocaleRaw,
    isLoading: isDefaultLoading,
    isFetching: isDefaultFetching,
  } = useGetDefaultLocaleAdminQuery();

  const activeLocales: AppLocaleItem[] = useMemo(() => {
    const items = Array.isArray(appLocalesItems) ? appLocalesItems : [];
    const active = items.filter((x) => !!x && !!x.code && x.is_active !== false);
    return uniqByCode(active);
  }, [appLocalesItems]);

  const localeOptions: LocaleOption[] = useMemo(
    () =>
      activeLocales.map((it) => ({
        value: toShortLocale(it.code),
        label: buildLocaleLabel(it),
      })),
    [activeLocales],
  );

  const defaultLocale = useMemo(() => toShortLocale(defaultLocaleRaw), [defaultLocaleRaw]);

  useEffect(() => {
    if (!localeOptions.length) return;

    if (selectedLocale && localeOptions.some((x) => x.value === selectedLocale)) return;

    if (defaultLocale && localeOptions.some((x) => x.value === defaultLocale)) {
      setSelectedLocale(defaultLocale);
      return;
    }

    setSelectedLocale(localeOptions[0].value);
  }, [localeOptions, selectedLocale, defaultLocale]);

  const effectiveLocaleForTab = useMemo(() => {
    const scope = TAB_SCOPE[activeTab] ?? 'mixed';
    if (scope === 'global') return '*';
    return selectedLocale || undefined;
  }, [activeTab, selectedLocale]);

  // ✅ LIST query only when we are on list / global_list
  const listArgs = useMemo(() => {
    const isListTab = activeTab === 'list' || activeTab === 'global_list';
    if (!isListTab) return undefined;

    const q = search?.trim() || undefined;

    if (!effectiveLocaleForTab) return undefined;

    return {
      q,
      locale: effectiveLocaleForTab, // 'tr' | 'en' | ... OR '*'
    };
  }, [activeTab, search, effectiveLocaleForTab]);

  const {
    data: settings,
    isLoading: isListLoading,
    isFetching: isListFetching,
    refetch,
  } = useListSiteSettingsAdminQuery(listArgs, { skip: !listArgs });

  const [deleteSetting, { isLoading: isDeleting }] = useDeleteSiteSettingAdminMutation();
  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingAdminMutation();

  const busy =
    isListLoading ||
    isListFetching ||
    isDeleting ||
    isSaving ||
    isLocalesLoading ||
    isLocalesFetching ||
    isDefaultLoading ||
    isDefaultFetching;

  const handleEdit = (setting: SiteSetting) => {
    setEditing(setting);
    setEditRaw(stringifyValuePretty(setting.value));
  };

  const handleCloseEdit = () => {
    setEditing(null);
    setEditRaw('');
  };

  const resolveLocaleForWrite = (): string | undefined => {
    const scope = TAB_SCOPE[activeTab] ?? 'mixed';
    if (scope === 'global') return '*';
    return selectedLocale || toShortLocale(editing?.locale) || undefined;
  };

  const handleSaveEdit = async () => {
    if (!editing) return;

    try {
      const value = parseRawValue(editRaw);
      const locale = resolveLocaleForWrite();

      await updateSetting({
        key: editing.key,
        locale,
        value,
      }).unwrap();

      toast.success(`"${editing.key}" ayarı güncellendi.`);
      handleCloseEdit();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message || err?.message || 'Ayar güncellenirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  const handleDelete = async (setting: SiteSetting) => {
    const key = setting.key;
    const delAll = window.confirm(
      `"${key}" anahtarı için TÜM dillerdeki kayıtlar silinsin mi?\n\nOK: Tüm diller\nCancel: Sadece bu satırın dili`,
    );

    try {
      if (delAll) {
        await deleteSetting({ key }).unwrap();
      } else {
        const scope = TAB_SCOPE[activeTab] ?? 'mixed';
        const loc =
          toShortLocale(setting.locale) || (scope === 'global' ? '*' : '') || selectedLocale;

        if (!loc) {
          toast.error('Tek dil silmek için locale bulunamadı.');
          return;
        }

        await deleteSetting({ key, locale: loc }).unwrap();
      }

      toast.success(`"${key}" ayarı silindi.`);
      await refetch();
    } catch (err: any) {
      const msg = err?.data?.error?.message || err?.message || 'Ayar silinirken bir hata oluştu.';
      toast.error(msg);
    }
  };

  return (
    <div className="container-fluid py-4">
      <SiteSettingsHeader
        search={search}
        onSearchChange={setSearch}
        locale={selectedLocale}
        onLocaleChange={setSelectedLocale}
        loading={busy}
        onRefresh={refetch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locales={localeOptions}
        localesLoading={
          isLocalesLoading || isLocalesFetching || isDefaultLoading || isDefaultFetching
        }
      />

      <div className="row">
        <div className="col-12">
          {(activeTab === 'list' || activeTab === 'global_list') && (
            <SiteSettingsList
              settings={settings}
              loading={busy}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedLocale={activeTab === 'global_list' ? '*' : selectedLocale}
            />
          )}

          {activeTab === 'general' && selectedLocale && (
            <GeneralSettingsTab locale={selectedLocale} />
          )}
          {activeTab === 'seo' && selectedLocale && <SeoSettingsTab locale={selectedLocale} />}
          {activeTab === 'footer' && selectedLocale && (
            <FooterSettingsTab locale={selectedLocale} />
          )}

          {activeTab === 'smtp' && <SmtpSettingsTab locale="*" />}
          {activeTab === 'cloudinary' && <CloudinarySettingsTab locale="*" />}
          {activeTab === 'api' && <ApiSettingsTab locale="*" />}
        </div>
      </div>

      {editing && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h5 className="modal-title small mb-0">
                    Ayar Düzenle: <code>{editing.key}</code>
                    {(() => {
                      const shown = resolveLocaleForWrite();
                      return shown ? (
                        <span className="badge bg-light text-dark border ms-2">{shown}</span>
                      ) : null;
                    })()}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Kapat"
                    onClick={handleCloseEdit}
                    disabled={isSaving}
                  />
                </div>

                <div className="modal-body">
                  <p className="text-muted small">
                    Bu modal tek bir <code>site_settings</code> kaydını hızlıca düzenlemek içindir.
                    Geçerli JSON girersen değer JSON olarak, aksi halde düz string olarak saklanır.
                  </p>

                  <div className="mb-2">
                    <label className="form-label small">Değer (raw / JSON)</label>
                    <textarea
                      className="form-control font-monospace"
                      rows={10}
                      value={editRaw}
                      onChange={(e) => setEditRaw(e.target.value)}
                      spellCheck={false}
                    />
                  </div>
                </div>

                <div className="modal-footer py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleCloseEdit}
                    disabled={isSaving}
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveEdit}
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

export default SiteSettingsAdminPage;
