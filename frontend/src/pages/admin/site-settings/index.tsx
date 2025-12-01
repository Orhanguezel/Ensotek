// =============================================================
// FILE: src/pages/admin/site-settings/index.tsx
// Ensotek – Site Ayarları Sayfası (tek sayfa, tab’lı, çoklu dil uyumlu)
// =============================================================

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useListSiteSettingsAdminQuery,
  useDeleteSiteSettingAdminMutation,
  useUpdateSiteSettingAdminMutation,
  type SiteSetting,
} from "@/integrations/rtk/endpoints/admin/site_settings_admin.endpoints";
import {
  SiteSettingsHeader,
  type SettingsTab,
  type LocaleOption,
} from "@/components/admin/site-settings/SiteSettingsHeader";
import { SiteSettingsList } from "@/components/admin/site-settings/SiteSettingsList";
import {
  GeneralSettingsTab,
  SeoSettingsTab,
  SmtpSettingsTab,
  CloudinarySettingsTab,
  ApiSettingsTab,
  FooterSettingsTab,
} from "@/components/admin/site-settings/tabs";
import type { SettingValue } from "@/integrations/types/site";

/* ------------------------------------------------------------- */
/*  Küçük yardımcılar (raw edit modal için)                      */
/* ------------------------------------------------------------- */

function stringifyValuePretty(v: SettingValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

// ❗ Artık SettingValue döndürüyoruz (unknown değil)
function parseRawValue(raw: string): SettingValue {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    // JSON.parse her şeyi dönebilir, biz bunu SettingValue olarak kullanacağız
    return JSON.parse(trimmed) as SettingValue;
  } catch {
    // JSON değilse düz string olarak sakla
    return trimmed;
  }
}

/* ------------------------------------------------------------- */
/*  Sayfa bileşeni                                               */
/* ------------------------------------------------------------- */

const SiteSettingsAdminPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<SettingsTab>("list");

  // Raw edit modal state
  const [editing, setEditing] = useState<SiteSetting | null>(null);
  const [editRaw, setEditRaw] = useState<string>("");

  // Ana liste sorgusu
  const {
    data: settings,
    isLoading,
    isFetching,
    refetch,
  } = useListSiteSettingsAdminQuery(
    search || localeFilter
      ? {
          q: search || undefined,
          locale: localeFilter || undefined,
        }
      : undefined,
  );

  // Diller için app_locales kaydını çek
  const {
    data: appLocaleRows,
    isLoading: isLocalesLoading,
  } = useListSiteSettingsAdminQuery({
    keys: ["app_locales"],
  });

  const [deleteSetting, { isLoading: isDeleting }] =
    useDeleteSiteSettingAdminMutation();

  const [updateSetting, { isLoading: isSaving }] =
    useUpdateSiteSettingAdminMutation();

  const loading = isLoading || isFetching;
  const busy = loading || isDeleting || isSaving;

  // app_locales value → string[] normalize et
  const localeCodes = useMemo(() => {
    if (!appLocaleRows || appLocaleRows.length === 0) {
      // Fallback – seed henüz yoksa
      return ["tr", "en"];
    }
    const row = appLocaleRows.find((r) => r.key === "app_locales");
    const v = row?.value;

    let arr: string[] = [];

    if (Array.isArray(v)) {
      arr = v.map((x) => String(x)).filter(Boolean);
    } else if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) {
          arr = parsed.map((x) => String(x)).filter(Boolean);
        }
      } catch {
        // parse edilemezse boş bırak
      }
    }

    if (!arr.length) {
      return ["tr", "en"];
    }

    // uniq
    return Array.from(new Set(arr));
  }, [appLocaleRows]);

  // string[] → LocaleOption[]
  const localeOptions: LocaleOption[] = useMemo(
    () =>
      localeCodes.map((code) => {
        const lower = code.toLowerCase();
        let label = `${code.toUpperCase()} (${lower})`;

        if (lower === "tr") label = "Türkçe (tr)";
        else if (lower === "en") label = "İngilizce (en)";
        else if (lower === "de") label = "Almanca (de)";

        return { value: lower, label };
      }),
    [localeCodes],
  );

  /* -------------------- Düzenle / Sil handler’ları -------------------- */

  const handleEdit = (setting: SiteSetting) => {
    setEditing(setting);
    setEditRaw(stringifyValuePretty(setting.value));
  };

  const handleCloseEdit = () => {
    setEditing(null);
    setEditRaw("");
  };

  const handleSaveEdit = async () => {
    if (!editing) return;

    try {
      const value = parseRawValue(editRaw); // 👉 SettingValue tipi

      await updateSetting({
        key: editing.key,
        locale: editing.locale || undefined,
        value, // Artık SettingValue, TS2322 gitmiş olmalı
      }).unwrap();

      toast.success(`"${editing.key}" ayarı güncellendi.`);
      handleCloseEdit();
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Ayar güncellenirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  const handleDelete = async (setting: SiteSetting) => {
    const key = setting.key;
    if (
      !window.confirm(
        `"${key}" anahtarı için TÜM dillerdeki kayıtlar silinecek. Emin misiniz?`,
      )
    ) {
      return;
    }

    try {
      await deleteSetting(key).unwrap();
      toast.success(`"${key}" ayarı silindi.`);
      await refetch();
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Ayar silinirken bir hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <div className="container-fluid py-4">
      <SiteSettingsHeader
        search={search}
        onSearchChange={setSearch}
        locale={localeFilter}
        onLocaleChange={setLocaleFilter}
        loading={busy}
        onRefresh={refetch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locales={localeOptions}
        localesLoading={isLocalesLoading}
      />

      <div className="row">
        <div className="col-12">
          {activeTab === "list" && (
            <SiteSettingsList
              settings={settings}
              loading={busy}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {activeTab === "general" && (
            <GeneralSettingsTab locale={localeFilter} />
          )}

          {activeTab === "seo" && <SeoSettingsTab locale={localeFilter} />}

          {activeTab === "smtp" && <SmtpSettingsTab locale={localeFilter} />}

          {activeTab === "cloudinary" && (
            <CloudinarySettingsTab locale={localeFilter} />
          )}

          {activeTab === "api" && <ApiSettingsTab locale={localeFilter} />}
          {activeTab === "footer" && (
            <FooterSettingsTab locale={localeFilter} />
          )}
        </div>
      </div>

      {/* --------------------- Sabit Raw Edit Modal --------------------- */}
      {editing && (
        <>
          {/* Backdrop */}
          <div className="modal-backdrop fade show" />

          {/* Modal */}
          <div
            className="modal d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header py-2">
                  <h5 className="modal-title small mb-0">
                    Ayar Düzenle: <code>{editing.key}</code>
                    {editing.locale && (
                      <span className="badge bg-light text-dark border ms-2">
                        {editing.locale}
                      </span>
                    )}
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
                    Bu modal tek bir <code>site_settings</code> kaydını hızlıca
                    düzenlemek içindir. Geçerli JSON girersen değer JSON olarak,
                    aksi halde düz string olarak saklanır.
                  </p>

                  <div className="mb-2">
                    <label className="form-label small">
                      Değer (raw / JSON)
                    </label>
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
                    {isSaving ? "Kaydediliyor..." : "Kaydet"}
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
