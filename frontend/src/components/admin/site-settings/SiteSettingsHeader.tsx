// =============================================================
// FILE: src/components/admin/site-settings/SiteSettingsHeader.tsx
// Ensotek – Site Ayarları Header + Filtreler + Tab Butonları
// =============================================================

import React from "react";

// Bu sayfadaki tab kimlikleri
export type SettingsTab =
  | "list"
  | "general"
  | "seo"
  | "smtp"
  | "payments"
  | "cloudinary"
  | "api"
  | "footer";

// Dinamik locale option tipi
export type LocaleOption = {
  value: string;
  label: string;
};

export type SiteSettingsHeaderProps = {
  search: string;
  onSearchChange: (v: string) => void;
  locale: string;
  onLocaleChange: (v: string) => void;
  loading: boolean;
  onRefresh: () => void;

  // Tab kontrolü
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;

  // Dinamik diller (DB’den geliyor)
  locales: LocaleOption[];
  localesLoading?: boolean;
};

const TAB_ITEMS: { id: SettingsTab; label: string }[] = [
  { id: "list", label: "Liste" },
  { id: "general", label: "Genel / UI" },
  { id: "seo", label: "SEO" },
  { id: "smtp", label: "SMTP / E-posta" },
  { id: "cloudinary", label: "Cloudinary / Storage" },
  { id: "api", label: "API & Entegrasyon" },
  { id: "footer", label: "Footer Ayarları" },
];

export const SiteSettingsHeader: React.FC<SiteSettingsHeaderProps> = ({
  search,
  onSearchChange,
  locale,
  onLocaleChange,
  loading,
  onRefresh,
  activeTab,
  onTabChange,
  locales,
  localesLoading,
}) => {
  return (
    <div className="row mb-3">
      {/* Sol: başlık + sekmeler */}
      <div className="col-12 col-lg-7 mb-2 mb-lg-0">
        <h1 className="h4 mb-1">Site Ayarları</h1>
        <p className="text-muted small mb-2">
          Ensotek sitesi için anahtar-değer bazlı ayarların tamamını listeler.
          Aşağıdaki tab butonlarına tıklayarak Genel/UI, SMTP, SEO, Cloudinary,
          API vb. formları aynı sayfa içinde bölüm bölüm görüntüleyebilirsin.
        </p>

        {/* Ayar grupları için tab butonları (routing yok, state ile kontrol) */}
        <div className="btn-group btn-group-sm flex-wrap" role="group">
          {TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                "btn btn-sm me-1 mb-1 " +
                (activeTab === tab.id
                  ? "btn-primary"
                  : "btn-outline-primary")
              }
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sağ: arama + locale seçici + yenile */}
      <div className="col-12 col-lg-5 d-flex align-items-end justify-content-lg-end">
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
          {/* Arama */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">Ara</span>
            <input
              type="text"
              className="form-control"
              placeholder="Key veya değer içinde ara"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Locale filtre (dinamik) */}
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              Dil
              {localesLoading && (
                <span className="ms-1 spinner-border spinner-border-sm" />
              )}
            </span>
            <select
              className="form-select"
              value={locale}
              onChange={(e) => onLocaleChange(e.target.value)}
            >
              {/* Her zaman Tüm Diller */}
              <option value="">Tüm Diller</option>
              {locales.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Yenile */}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onRefresh}
            disabled={loading}
          >
            Yenile
          </button>
        </div>
      </div>
    </div>
  );
};
