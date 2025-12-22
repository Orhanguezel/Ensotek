// =============================================================
// FILE: src/components/admin/menuitem/MenuItemHeader.tsx
// Ensotek – Admin Menu Items Header / Filters (locale destekli)
// - Locale normalize: short code (tr-TR -> tr)
// - Locales listesi: site_settings.app_locales (parent'tan gelir)
// =============================================================

import React from 'react';

export type LocaleOption = {
  value: string; // "tr", "en"...
  label: string; // "Türkçe (tr)"...
};

export type MenuItemFilters = {
  search: string;
  location: 'all' | 'header' | 'footer';
  active: 'all' | 'active' | 'inactive';
  sort: 'display_order' | 'created_at' | 'title';
  order: 'asc' | 'desc';
  locale: string; // "" => tüm diller, aksi => "tr"/"en"...
};

export type MenuItemHeaderProps = {
  filters: MenuItemFilters;
  total: number;
  loading: boolean;
  locales: LocaleOption[];
  localesLoading?: boolean;
  defaultLocale?: string;
  onFiltersChange: (next: MenuItemFilters) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
};

/* -------------------- helpers -------------------- */
const toShortLocale = (v: unknown): string =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace('_', '-')
    .split('-')[0]
    .trim();

export const MenuItemHeader: React.FC<MenuItemHeaderProps> = ({
  filters,
  total,
  loading,
  locales,
  localesLoading,
  defaultLocale,
  onFiltersChange,
  onRefresh,
  onCreateClick,
}) => {
  const handleInputChange =
    (field: keyof MenuItemFilters) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value as any;
      onFiltersChange({ ...filters, [field]: value });
    };

  const handleOrderToggle = () => {
    onFiltersChange({
      ...filters,
      order: filters.order === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const raw = e.target.value;
    const next = raw ? toShortLocale(raw) : '';
    onFiltersChange({
      ...filters,
      locale: next,
    });
  };

  const effectiveDefaultLocale = toShortLocale(defaultLocale ?? 'tr');

  const localeSelectDisabled = loading || (!!localesLoading && locales.length === 0);

  return (
    <div className="row mb-3 g-2 align-items-end">
      {/* Sol taraf */}
      <div className="col-md-7">
        <div className="card">
          <div className="card-body py-2">
            <div className="row g-2 align-items-end">
              {/* Arama */}
              <div className="col-12 col-md-4">
                <label className="form-label small mb-1">Ara (başlık / URL)</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Başlık / URL içinde ara..."
                  value={filters.search}
                  onChange={handleInputChange('search')}
                  disabled={loading}
                />
              </div>

              {/* Dil */}
              <div className="col-6 col-md-3">
                <label className="form-label small mb-1">
                  Dil {localesLoading && <span className="spinner-border spinner-border-sm ms-1" />}
                </label>
                <select
                  className="form-select form-select-sm"
                  value={toShortLocale(filters.locale)}
                  onChange={handleLocaleChange}
                  disabled={localeSelectDisabled}
                >
                  <option value="">
                    Tüm diller
                    {effectiveDefaultLocale ? ` (varsayılan: ${effectiveDefaultLocale})` : ''}
                  </option>

                  {(locales ?? []).map((loc) => (
                    <option key={loc.value} value={toShortLocale(loc.value)}>
                      {loc.label}
                    </option>
                  ))}
                </select>

                <div className="form-text small">
                  Dil listesi <code>site_settings.app_locales</code> kaydından yüklenir.
                </div>
              </div>

              {/* Konum */}
              <div className="col-6 col-md-2">
                <label className="form-label small mb-1">Konum</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.location}
                  onChange={handleInputChange('location')}
                  disabled={loading}
                >
                  <option value="all">Tüm konumlar</option>
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </select>
              </div>

              {/* Aktif */}
              <div className="col-6 col-md-3">
                <label className="form-label small mb-1">Aktiflik</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.active}
                  onChange={handleInputChange('active')}
                  disabled={loading}
                >
                  <option value="all">Tümü</option>
                  <option value="active">Sadece aktif</option>
                  <option value="inactive">Sadece pasif</option>
                </select>
              </div>

              {/* Sort */}
              <div className="col-6 col-md-3">
                <label className="form-label small mb-1">Sıralama alanı</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.sort}
                  onChange={handleInputChange('sort')}
                  disabled={loading}
                >
                  <option value="display_order">Sıra (display_order)</option>
                  <option value="created_at">Oluşturulma</option>
                  <option value="title">Başlık</option>
                </select>
              </div>

              {/* Order desktop */}
              <div className="col-6 col-md-3 d-none d-md-block">
                <label className="form-label small mb-1 d-block">Yön</label>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm w-100"
                  disabled={loading}
                  onClick={handleOrderToggle}
                >
                  {filters.order === 'asc' ? 'Artan ↑' : 'Azalan ↓'}
                </button>
              </div>

              {/* Order mobile */}
              <div className="col-6 d-block d-md-none">
                <label className="form-label small mb-1">Yön</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.order}
                  onChange={handleInputChange('order')}
                  disabled={loading}
                >
                  <option value="asc">Artan</option>
                  <option value="desc">Azalan</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ taraf */}
      <div className="col-md-5">
        <div className="card">
          <div className="card-body py-2">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="small text-muted">
                <div className="fw-semibold">Menü Öğeleri</div>
                <div>
                  Toplam <span className="fw-semibold">{Number.isFinite(total) ? total : 0}</span>{' '}
                  kayıt görüntüleniyor.
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  disabled={loading}
                  onClick={onRefresh}
                >
                  {loading ? 'Yenileniyor...' : 'Yenile'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                  onClick={onCreateClick}
                >
                  + Yeni Menü Öğesi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
